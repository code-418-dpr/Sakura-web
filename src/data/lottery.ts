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
                start ? { start: { lte: start } } : {},
                end ? { end: { gte: end } } : {},
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
