"use server";

import prisma from "@/lib/prisma";
import { LotteryRequestData } from "@/types/lottery-request-data";

interface SearchLotteriesParams {
    query?: string;
    start?: Date;
    end?: Date;
    isVip?: boolean;
    prizeType?: "MONEY" | "POINTS" | "PRODUCTS";
    isReal?: boolean;
    ticketPrice?: number;
    minTicketPrice?: number;
    maxTicketPrice?: number;
    page?: number;
    pageSize?: number;
}

export async function searchLotteries(params: SearchLotteriesParams) {
    const {
        query,
        prizeType,
        start,
        end,
        isVip,
        isReal,
        ticketPrice,
        minTicketPrice,
        maxTicketPrice,
        page = 1,
        pageSize = 9,
    } = params;
    const response = await prisma.lottery.findMany({
        where: {
            AND: [
                prizeType
                    ? prizeType === "POINTS"
                        ? { isReal: false }
                        : prizeType === "PRODUCTS"
                          ? { AND: [{ isReal: true }, { prizes: { some: { title: { not: null } } } }] }
                          : { AND: [{ isReal: true }, { prizes: { some: { moneyPrice: { gt: 0 } } } }] }
                    : {},
                query
                    ? {
                          OR: [
                              { title: { contains: query, mode: "insensitive" } },
                              { description: { contains: query, mode: "insensitive" } },
                          ],
                      }
                    : {},
                start ? { start: { gte: start } } : {}, // Лотереи, которые закончились после начала диапазона
                end ? { end: { lte: end } } : {},
                isVip ? { participantsCount: 0 } : {},
                isReal ? { isReal: { equals: isReal } } : {},
                ticketPrice ? { ticketPrice: { equals: ticketPrice } } : {},
                minTicketPrice ? { ticketPrice: { gte: minTicketPrice } } : {},
                maxTicketPrice ? { ticketPrice: { lte: maxTicketPrice } } : {},
            ],
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
    });
    const total = await prisma.lottery.count({});
    return {
        items: response.map((lottery) => ({
            ...lottery,
            type: lottery.isReal ? "REAL" : "VIRTUAL",
            image: lottery.image ? Buffer.from(lottery.image).toString("base64") : null,
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}

export const getLotteryById = async (id: string) => {
    const response = await prisma.lottery.findUnique({ where: { id: id }, include: { prizes: true } });
    return {
        ...response,
        type: response?.isReal ? "REAL" : "VIRTUAL",
        image: response?.image ? Buffer.from(response.image).toString("base64") : null,
    };
};

export const getLotteryByTitle = async (title: string) => {
    return prisma.lottery.findFirst({ where: { title: { equals: title } } });
};

export const getLotteryAll = async () => {
    return prisma.lottery.findMany({});
};

export const getLotteryPrice = async (id: string) => {
    const lottery = await prisma.lottery.findFirst({
        where: { id: { equals: id } },
        select: { ticketPrice: true, vipDiscount: true },
    });
    if (!lottery) {
        throw new Error("Lottery not found");
    }
    return {
        ticketPrice: lottery.ticketPrice,
        primeTicketPrice: lottery.ticketPrice * (lottery.vipDiscount / 100),
    };
};

export const createLottery = async (data: LotteryRequestData) => {
    return prisma.lottery.create({
        data,
    });
};
