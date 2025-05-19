// src/providers/auth-provider.tsx
"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

// src/providers/auth-provider.tsx

export function AuthProvider({ children, session }: { children: React.ReactNode; session?: Session }) {
    return <SessionProvider session={session}>{children}</SessionProvider>;
}
