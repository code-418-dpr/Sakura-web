import bcrypt from "bcryptjs";

import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { UserRole } from "@/app/generated/prisma";
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
                    if (!credentials?.email || !credentials.password) {
                        console.log("Нет email или пароля");
                        return null;
                    }

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
                        return null;
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user as User | undefined) {
                token.id = user.id;
                token.name = user.name;
                token.role = user.role as UserRole;
            }
            return token;
        },
        session({ session, token }) {
            session.user.id = token.id;
            session.user.role = token.role as UserRole;
            session.user.name = token.name;
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
    secret: process.env.NEXTAUTH_SECRET,
};
