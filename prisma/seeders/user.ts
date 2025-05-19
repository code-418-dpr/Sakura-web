import { Prisma } from "@/app/generated/prisma";
import { createUser, getUserByEmail } from "@/data/user";

const USERS: Prisma.UserCreateInput[] = [
    { 
        name: "Scorpion", 
        email: "s.scorpi-on@ya.ru", 
        emailVerified: new Date(), 
        password: "s.scorpi-on@ya.ru",
        vipDatetime : new Date(),
        realBalance: 5000,
        virtualBalance: 1000,
        score: 0,
        lastActivity: new Date(),
        role: "ADMIN",
    },
    { 
        name: "Vlad", 
        email: "vladimir.ivanov@gmail.com", 
        emailVerified: new Date(), 
        password: "vladimir.ivanov@gmail.com",
        vipDatetime : new Date(),
        realBalance: 5000,
        virtualBalance: 1000,
        score: 0,
        lastActivity: new Date(),
    },
    { 
        name: "AnnaPet", 
        email: "anna.petrova@gmail.com", 
        emailVerified: new Date(), 
        password: "anna.petrova@gmail.com",
        vipDatetime : new Date(),
        realBalance: 5000,
        virtualBalance: 1000,
        score: 0,
        lastActivity: new Date(),
    },
    { 
        name: "IvanI", 
        email: "ivan.ivanov@gmail.com", 
        emailVerified: new Date(), 
        password: "ivan.ivanov@gmail.com",
        vipDatetime : new Date(),
        realBalance: 5000,
        virtualBalance: 1000,
        score: 0,
        lastActivity: new Date(),
    },
    { 
        name: "MariaS", 
        email: "maria.sidorova@gmail.com", 
        emailVerified: new Date(), 
        password: "maria.sidorova@gmail.com",
        vipDatetime : new Date(),
        realBalance: 5000,
        virtualBalance: 1000,
        score: 0,
        lastActivity: new Date(),
    },
    { 
        name: "ElenaV", 
        email: "elena.vasilieva@gmail.com", 
        emailVerified: new Date(), 
        password: "elena.vasilieva@gmail.com",
        vipDatetime : new Date(),
        realBalance: 5000,
        virtualBalance: 1000,
        score: 0,
        lastActivity: new Date(),
    },
    { 
        name: "DmitryM", 
        email: "dmitry.mikhailov@gmail.com", 
        emailVerified: new Date(), 
        password: "dmitry.mikhailov@gmail.com",
        vipDatetime : new Date(),
        realBalance: 5000,
        virtualBalance: 1000,
        score: 0,
        lastActivity: new Date(),
    },
    { 
        name: "NataliaS", 
        email: "natalia.sergeeva@gmail.com", 
        emailVerified: new Date(), 
        password: "natalia.sergeeva@gmail.com",
        vipDatetime : new Date(),
        realBalance: 5000,
        virtualBalance: 1000,
        score: 0,
        lastActivity: new Date(),
    },
    { 
        name: "OlgaN", 
        email: "olga.nikolaeva@gmail.com", 
        emailVerified: new Date(), 
        password: "olga.nikolaeva@gmail.com",
        vipDatetime : new Date(),
        realBalance: 5000,
        virtualBalance: 1000,
        score: 0,
        lastActivity: new Date(),
    },
];

export async function seedUsers() {
    for (const { name, email, password } of USERS) {
        if (!(await getUserByEmail(email))) {
            await createUser(name, email, password);
        }
    }
}
