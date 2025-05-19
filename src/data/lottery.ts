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
}

export async function searchLotteries(params: SearchLotteriesParams) {
    const { query, prizeType, start, end, isVip, isReal, ticketPrice, minTicketPrice, maxTicketPrice } = params;
    return prisma.lottery.findMany({
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
                start ? { start: { lte: start } } : {},
                end ? { end: { gte: end } } : {},
                isVip ? { participantsCount: 0 } : {},
                isReal ? { isReal: { equals: isReal } } : {},
                ticketPrice ? { ticketPrice: { equals: ticketPrice } } : {},
                minTicketPrice ? { ticketPrice: { gte: minTicketPrice } } : {},
                maxTicketPrice ? { ticketPrice: { lte: maxTicketPrice } } : {},
            ],
        },
    });
}

export const getLotteryByTitle = async (title: string) => {
    return prisma.lottery.findFirst({ where: { title: { equals: title } } });
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
    rules: string
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
