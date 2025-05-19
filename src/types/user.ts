import { UserRole } from "@/app/generated/prisma";

export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    phone: string | null;
    image: string | null;
    password: string;
    role: UserRole;
    vipDatetime: Date | null;
    inviterId: string | null;
    realBalance: bigint;
    virtualBalance: bigint;
    score: bigint;
    lastActivity: Date;
}
