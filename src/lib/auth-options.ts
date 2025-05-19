import bcrypt from "bcryptjs";

import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials.password) return null;

                    if (
                        credentials.email === process.env.ADMIN_EMAIL &&
                        credentials.password === process.env.ADMIN_PASSWORD
                    ) {
                        return {
                            id: "admin-id",
                            email: process.env.ADMIN_EMAIL,
                        };
                    }

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
                        throw new Error("Неверный email или пароль");
                    }

                    return {
                        id: user.id,
                        email: user.email,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user as User | undefined) {
                token.id = user.id;
            }
            return token;
        },
        session({ session, token }) {
            if (token.id) {
                session.user.id = token.id;
            }
            return session;
        },
        redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    secret: process.env.AUTH_SECRET,
};
