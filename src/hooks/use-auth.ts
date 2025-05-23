"use client";

import { useSession } from "next-auth/react";

import { UserRole } from "@/app/generated/prisma";

export const useAuth = () => {
    const { data: session, status, update } = useSession();

    return {
        user: session?.user,
        isLoading: status === "loading",
        isAuthenticated: status === "authenticated",
        role: session?.user.role as UserRole,
        update,
    };
};
