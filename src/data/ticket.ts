"use server";

import db from "@/lib/prisma";

export const createTicket = async (userId: string, lotteryId: string, price: number) => {
    // 1. Получаем лимит участников
    const lottery = await db.lottery.findUnique({
        where: { id: lotteryId },
        select: { participantsCount: true },
    });

    if (!lottery) throw new Error("Лотерея не найдена");

    const totalPlaces = lottery.participantsCount;

    // 2. Получаем уже занятые места
    const takenPlaces = await db.ticket.findMany({
        where: { lotteryId },
        select: { place: true },
    });

    const occupiedSet = new Set(takenPlaces.map((t) => t.place));

    // 3. Проверяем, остались ли свободные места
    if (occupiedSet.size >= totalPlaces) {
        throw new Error("Все места заняты");
    }

    // 4. Находим случайное свободное место
    let place: number;
    for (;;) {
        const randomPlace = Math.floor(Math.random() * totalPlaces) + 1;
        if (!occupiedSet.has(randomPlace)) {
            place = randomPlace;
            break;
        }
    }

    // 5. Создаём билет с уникальным местом
    return db.ticket.create({
        data: {
            userId,
            lotteryId,
            price,
            place,
        },
    });
};

export async function getLotteryWinnerTickets(lotteryId: string) {
    const lottery = await db.lottery.findUnique({ where: { id: lotteryId }, select: { winnersCount: true } });
    if (!lottery) {
        return null;
    }
    return db.ticket.findMany({
        where: { lotteryId },
        orderBy: { place: "asc" },
        take: lottery.winnersCount,
    });
}
