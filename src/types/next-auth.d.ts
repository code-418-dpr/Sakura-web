import "next-auth";

import { UserRole } from "@prisma/client";

declare module "next-auth" {
    interface User {
        name: string;
        role: UserRole;
        id: string;
        realBalance: string;
        virtualBalance: string;
        lastActivity: Date;
        isVip: boolean;
    }

    interface Session {
        user: {
            id: string;
            name: string;
            email?: string | null;
            image?: string | null;
            role: UserRole;
            realBalance: string;
            virtualBalance: string;
            lastActivity: Date;
            isVip: boolean;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: UserRole;
        name: string;
        realBalance: string;
        virtualBalance: string;
        lastActivity: Date;
        isVip: boolean;
    }
}
