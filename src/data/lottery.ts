"use server";

import prisma from "@/lib/prisma";
import { LotteryRequestData } from "@/types/lottery-request-data";

import { UserLotteryData, UsersLotteryTicket } from "./userLottery";

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
interface PaginationParams {
    page?: number;
    pageSize?: number;
}
export interface PaginatedResult<T> {
    data: T;
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
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
export const getUserLotteryData = async (
    userId: string,
    params?: PaginationParams,
): Promise<PaginatedResult<UserLotteryData> | null> => {
    try {
        const page = params?.page ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const skip = (page - 1) * pageSize;

        const totalItems = await prisma.ticket.count({
            where: { userId },
        });

        const userWithData = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                tickets: {
                    select: {
                        number: true,
                        price: true,
                        place: true,
                        lottery: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                isReal: true,
                                image: true,
                                start: true,
                                end: true,
                                ticketPrice: true,
                                participantsCount: true,
                                winnersCount: true,
                                vipDiscount: true,
                                vipParticipantsCount: true,
                                rules: true,
                                prizes: {
                                    select: {
                                        id: true,
                                        title: true,
                                        moneyPrice: true,
                                        pointsPrice: true,
                                        count: true,
                                    },
                                },
                            },
                        },
                    },
                    skip,
                    take: pageSize,
                },
            },
        });

        if (!userWithData) return null;

        const totalPages = Math.ceil(totalItems / pageSize);

        return {
            data: {
                userId: userWithData.id,
                lotteries: userWithData.tickets.map((ticket) => ({
                    ...ticket.lottery,
                    type: ticket.lottery.isReal ? "REAL" : "VIRTUAL",
                    image: ticket.lottery.image ? Buffer.from(ticket.lottery.image).toString("base64") : null,
                    ticketPrice: Number(ticket.lottery.ticketPrice),
                    participantsCount: ticket.lottery.participantsCount.toString(),
                    winnersCount: ticket.lottery.winnersCount.toString(),
                    vipDiscount: ticket.lottery.vipDiscount,
                    vipParticipantsCount: ticket.lottery.vipParticipantsCount.toString(),
                    rules: ticket.lottery.rules,
                    userTicket: {
                        number: ticket.number,
                        price: Number(ticket.price),
                        place: ticket.place,
                    },
                    prizes: ticket.lottery.prizes.map((prize) => ({
                        ...prize,
                        moneyPrice: Number(prize.moneyPrice),
                        pointsPrice: Number(prize.pointsPrice),
                    })),
                })),
                start: "",
            },
            pagination: {
                page: page,
                pageSize,
                totalItems,
                totalPages,
            },
        };
    } catch (error) {
        console.error("Error fetching user lottery data:", error);
        throw new Error("Failed to fetch user lottery information");
    }
};

export const getUserLotteryById = async (userId: string, lotteryId: string): Promise<UsersLotteryTicket | null> => {
    try {
        const tickets = await prisma.ticket.findMany({
            where: {
                userId,
                lotteryId,
            },
            select: {
                number: true,
                price: true,
                place: true,
                lottery: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        isReal: true,
                        image: true,
                        start: true,
                        end: true,
                        ticketPrice: true,
                        participantsCount: true,
                        winnersCount: true,
                        vipDiscount: true,
                        vipParticipantsCount: true,
                        rules: true,
                        prizes: {
                            select: {
                                id: true,
                                title: true,
                                moneyPrice: true,
                                pointsPrice: true,
                                count: true,
                            },
                        },
                    },
                },
            },
        });

        if (!tickets.length || !tickets[0]) return null;

        const lottery = tickets[0].lottery;

        const result: UsersLotteryTicket = {
            id: lottery.id,
            title: lottery.title,
            description: lottery.description,
            type: lottery.isReal ? "REAL" : "VIRTUAL",
            image: lottery.image ? Buffer.from(lottery.image).toString("base64") : null,
            start: lottery.start,
            end: lottery.end,
            ticketPrice: Number(lottery.ticketPrice),
            participantsCount: lottery.participantsCount.toString(),
            winnersCount: lottery.winnersCount.toString(),
            vipDiscount: lottery.vipDiscount,
            vipParticipantsCount: lottery.vipParticipantsCount.toString(),
            rules: lottery.rules,
            userTickets: tickets.map((ticket) => ({
                number: ticket.number,
                price: Number(ticket.price),
                place: ticket.place,
            })),
            prizes: lottery.prizes.map((prize) => ({
                id: prize.id,
                title: prize.title,
                moneyPrice: Number(prize.moneyPrice),
                pointsPrice: Number(prize.pointsPrice),
                count: prize.count,
            })),
        };

        return result;
    } catch (error) {
        console.error("Error fetching user lottery tickets:", error);
        throw new Error("Failed to fetch user lottery tickets");
    }
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
    return prisma.$transaction(async (prisma) => {
        // Сначала создаем лотерею
        const lottery = await prisma.lottery.create({
            data: {
                title: data.title,
                description: data.description,
                isReal: data.isReal,
                participantsCount: data.participantsCount,
                vipParticipantsCount: data.vipParticipantsCount,
                winnersCount: data.winnersCount,
                primeWinnersCount: data.primeWinnersCount,
                ticketPrice: data.ticketPrice,
                vipDiscount: data.vipDiscount,
                start: data.start,
                end: data.end,
                rules: data.rules,
            },
        });

        // Затем создаем призы для этой лотереи
        const prizes = data.prizes;
        if (prizes.length > 0) {
            await prisma.prize.createMany({
                data: prizes.map((prize) => ({
                    title: prize.title,
                    moneyPrice: data.isReal ? prize.value : 0,
                    pointsPrice: data.isReal ? 0 : prize.value,
                    count: 1,
                    lotteryId: lottery.id,
                })),
            });
        }

        return lottery;
    });
};
