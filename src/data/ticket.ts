"use server";

import db from "@/lib/prisma";

export const createTicket = async (
    userId: string,
    lotteryId: string,
    price: number,
) => {
    return db.ticket.create({ data: { userId, lotteryId, price } });
};