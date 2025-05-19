"use server";

import bcrypt from "bcryptjs";

import { UserRole } from "@/app/generated/prisma";
import db from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
    return db.user.findUnique({ where: { email } });
};

export const getUserById = async (id: string) => {
    return db.user.findUnique({ where: { id } });
};

export const createUser = async (name: string, email: string, password: string, role?: UserRole) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return db.user.create({ data: { name, email, password: hashedPassword, role } });
};
