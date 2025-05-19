import { Prisma } from "@/app/generated/prisma";
import { createUser, getUserByEmail } from "@/data/user";

const USERS: Prisma.UserCreateInput[] = [
    { name: "Сергей Евтушенко", email: "s.scorpi-on@ya.ru", password: "s.scorpi-on@ya.ru" },
    { name: "Админ", email: "admin@admin.com", password: "admin@admin.com" },
];

export async function seedUsers() {
    for (const { name, email, password } of USERS) {
        if (!(await getUserByEmail(email))) {
            await createUser(name, email, password);
        }
    }
}
