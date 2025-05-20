import db from "@/lib/prisma";

export async function createUserLevel(title: string, score: bigint) {
    return db.userLevel.create({ data: { title, score } });
}

export async function getLevelOfUser(userId: string) {
    const levels = await db.userLevel.findMany({ orderBy: { score: "asc" } });
    const userScore = (await db.user.findUnique({ where: { id: userId }, select: { score: true } }))!.score;
    let result: string = levels[0].title;
    for (const level of levels) {
        if (userScore > level.score) {
            result = level.title;
        }
    }
    return result;
}
