"use server";

import db from "@/lib/prisma";

export async function createUserLevel(title: string, score: bigint) {
    return db.userLevel.create({ data: { title, score } });
}

export async function getLevelOfUser(userId: string) {
    const levels = await db.userLevel.findMany({ orderBy: { score: "asc" } });

    // Если уровней нет — возвращаем "0" или другой дефолт
    if (levels.length === 0) return "0";

    const user = await db.user.findUnique({ where: { id: userId }, select: { score: true } });

    // Если пользователь не найден или score отсутствует
    if (!user?.score) return levels[0].title;

    const userScore = user.score;

    let result: string = levels[0].title;
    for (const level of levels) {
        if (userScore > level.score) {
            result = level.title;
        }
    }

    return result;
}
