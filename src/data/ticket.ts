"use server";

import prisma from "@/lib/prisma";

interface SearchRepresentativeEventsParams {
    query?: string;
    start?: Date;
    end?: Date;
    isVip?: boolean;
    prizeType?: "MONEY" | "POINTS" |"PRODUCTS";
    isReal?: boolean;
    ticketPrice?: number;
    minTicketPrice?: number;
    maxTicketPrice?: number;
}

export async function searchRepresentativeEvents(params: SearchRepresentativeEventsParams) {
    const {
        query,
        start,
        end,
        isVip,
        prizeType,
        isReal,
        ticketPrice,
        minTicketPrice,
        maxTicketPrice
    } = params;
    return prisma.lottery.findMany({
        where: {
            AND: [
                start ? { start: { lte: start } } : {},
                end ? { end: { gte: end } } : {},
                isVip ? { participantsCount: 0 } : {},
                prizeType ? { prizeType: { equals: prizeType } } : {},
                isReal ? { isReal: { equals: isReal } } : {},
                ticketPrice ? { ticketPrice: { equals: ticketPrice } } : {},
                minTicketPrice ? { ticketPrice: { gte: minTicketPrice } } : {},
                maxTicketPrice ? { ticketPrice: { lte: maxTicketPrice } } : {},
                query
                    ? {
                          OR: [
                              { title: { contains: query, mode: "insensitive" } },
                              { description: { contains: query, mode: "insensitive" } },
                          ],
                      }
                    : {},
            ]
            
        },
    });
}