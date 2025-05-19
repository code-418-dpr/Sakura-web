import "next-auth";

import { UserRole } from "@prisma/client";

declare module "next-auth" {
    interface User {
        name: string;
        role: UserRole;
        id: string;
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
