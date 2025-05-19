// src/types/next-auth.d.ts
import "next-auth";

import { UserRole } from "@prisma/client";

declare module "next-auth" {
    interface User {
        role: UserRole;
        id: string;
        name: string;
    }

    interface Session {
        user: {
            id: string;
            name: string;
            email?: string | null;
            image?: string | null;
            role: UserRole;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: UserRole;
        name: string;
    }
}
