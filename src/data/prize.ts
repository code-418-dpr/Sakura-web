"use server";

import db from "@/lib/prisma";

export const getPrizeByTitle = async (title: string) => {
    return db.prize.findFirst({ where: { title: { equals: title } } });
};

export const createPrize = async (
    title: string, 
    lotteryId: string,
    moneyPrice: number,
    pointsPrice: number,  
    count:number
) => {
    return db.prize.create({ data: { title, lotteryId, moneyPrice, pointsPrice, count } });
};