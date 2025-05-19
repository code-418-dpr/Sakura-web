"use server";

import prisma from "@/lib/prisma";

interface SearchRepresentativeEventsParams {
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

export async function searchRepresentativeEvents(params: SearchRepresentativeEventsParams) {
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
