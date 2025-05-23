import React, { Suspense } from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Loading from "@/app/loading";
import { AuthProvider } from "@/components/auth-provider";
import { Providers } from "@/components/providres";

import "../globals.css";

export const metadata: Metadata = {
    title: "Sakura",
    description: "Создано в рамках Кубка России по спортивному программированию",
    icons: {
        icon: "/favicon.ico",
        apple: '/apple-touch-icon.png',
    },
};

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className={inter.className}>
                <AuthProvider>
                    <Suspense fallback={<Loading />}>
                        <Providers>{children}</Providers>
                    </Suspense>
                </AuthProvider>
            </body>
        </html>
    );
}
