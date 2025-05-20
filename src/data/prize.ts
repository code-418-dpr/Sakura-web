"use server";

import db from "@/lib/prisma";

export const getPrizeByTitle = async (title: string) => {
    return db.prize.findFirst({ where: { title: { equals: title } } });
};

export const getPrizeByLotteryIdAndMoneyPrize = async (lotteryId: string, moneyPrice: number) => {
    return db.prize.findFirst({
        where: {
            lotteryId: { equals: lotteryId },
            moneyPrice: { equals: moneyPrice },
        },
    });
};

export const createPrize = async (
    title: string,
    lotteryId: string,
    moneyPrice: number,
    pointsPrice: number,
    count: number,
) => {
    return db.prize.create({ data: { title, lotteryId, moneyPrice, pointsPrice, count } });
};

export async function getLotteryPrizes(lotteryId: string) {
    const lottery = await db.lottery.findUnique({ where: { id: lotteryId }, select: { winnersCount: true } });
    if (!lottery) {
        return null;
    }
    return db.prize.findMany({
        where: { lotteryId },
        take: lottery.winnersCount,
    });
}
