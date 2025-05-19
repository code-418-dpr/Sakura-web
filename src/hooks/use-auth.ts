"use client";

import { useSession } from "next-auth/react";

import { UserRole } from "@/app/generated/prisma";
import { user } from "@heroui/react";

export const useAuth = () => {
    const { data: session, status } = useSession();

    return {
        user: session?.user,
        name: user.name,
        isLoading: status === "loading",
        isAuthenticated: status === "authenticated",
        role: session?.user.role as UserRole,
    };
};
