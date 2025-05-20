"use server";

import bcrypt from "bcryptjs";

import { UserRole } from "@/app/generated/prisma";
import db from "@/lib/prisma";
import { User } from "@/types/user";

export const getUsers = async (): Promise<User[]> => {
    return db.user.findMany();
};
export const getUserByEmail = async (email: string) => {
    return db.user.findUnique({ where: { email } });
};

export const getUserById = async (id: string) => {
    return db.user.findUnique({ where: { id } });
};

export const awardReferalUserById = async (id: string) => {
    return db.user.update({
        where: { id },
        data: {
            virtualBalance: {
                increment: 100n,
            },
        },
    });
};

export const createUser = async (name: string, email: string, password: string, role?: UserRole) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return db.user.create({ data: { name, email, password: hashedPassword, role } });
};

export const updateUser = async (id: string, realBalance: number, virtualBalance: number) => {
    return db.user.update({
        where: { id: id },
        data: {
            realBalance: BigInt(Math.round(realBalance)),
            virtualBalance: BigInt(Math.round(virtualBalance)),
            lastActivity: new Date(),
        },
    });
};
export const updateUserVip = async (id: string, vipDays: number) => {
    const vipDate = new Date();
    vipDate.setDate(vipDate.getDate() + vipDays);

    return db.user.update({
        where: { id: id },
        data: {
            vipDatetime: vipDate,
            lastActivity: new Date(),
        },
    });
};
