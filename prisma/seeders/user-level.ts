import { createUserLevel } from "@/data/user-level";
import db from "@/lib/prisma";

const USER_LEVELS: Record<string, number> = {
    Новичок: 100,
    Любитель: 200,
    "В теме": 300,
    Лудоман: 400,
    Ветеран: 500,
};

export async function seedUserLevels() {
    await db.userLevel.deleteMany();

    for (const [title, score] of Object.entries(USER_LEVELS)) {
        await createUserLevel(title, BigInt(score));
    }
}
