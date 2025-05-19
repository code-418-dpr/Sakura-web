"use server";

import prisma from "@/lib/prisma";

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
    const total = response.length;
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

export const createLottery = async (
    title: string,
    description: string,
    isReal: boolean,
    participantsCount: number,
    vipParticipantsCount: number,
    winnersCount: number,
    primeWinnersCount: number,
    ticketPrice: number,
    vipDiscount: number,
    start: Date,
    end: Date,
    rules: string,
) => {
    return prisma.lottery.create({
        data: {
            title,
            description,
            isReal,
            participantsCount,
            vipParticipantsCount,
            winnersCount,
            primeWinnersCount,
            ticketPrice,
            vipDiscount,
            start,
            end,
            rules,
        },
    });
};
