"use client";

import React, { useEffect, useState } from "react";

import { AchievementGrid } from "@/app/sakura/_components/achievements";
import NavbarElement from "@/components/Navbar/navbar";
import { getUserByEmail } from "@/data/user";
import { useAuth } from "@/hooks/use-auth";
import { PageTab } from "@/types/tabs";
import { User } from "@/types/user";
import { Image, Skeleton } from "@heroui/react";

export default function SakuraPage() {
    const [activeTab, setActiveTab] = useState<PageTab>("sakura");
    const { user } = useAuth();
    const [fullUser, setFullUser] = useState<User | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.email) {
                try {
                    const fetchedUser = await getUserByEmail(user.email);
                    setFullUser(fetchedUser);
                } catch (error) {
                    console.error("Ошибка при получении пользователя:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        void fetchUserData();
    }, [user]);

    const sakuraState = getSakuraState(fullUser);

    return (
        <div>
            <NavbarElement activeTab={activeTab} setActiveTabAction={setActiveTab} />
            <div className="container mx-auto py-6">
                <div className="grid gap-6 md:grid-cols-[400px_1fr]">
                    <div className="mt-4 flex flex-col items-center">
                        {!isLoading ? (
                            <div className="items-center">
                                <Image
                                    className="justify-center"
                                    src={`/sakura-state/${sakuraState}.png`}
                                    alt={sakuraState}
                                    width={400}
                                    height={400}
                                />
                                <p className="my-2 text-center">Ваша сакура активности</p>
                                {sakuraState === "good" ? (
                                    <p className="text-center text-lime-200">Ваша сакура цветёт и пахнет</p>
                                ) : sakuraState === "normal" ? (
                                    <p className="text-center text-yellow-200">
                                        От Вас давно не было активности, сакура увядает, помогите ей совершив покупку
                                    </p>
                                ) : (
                                    <p className="text-center text-rose-400">
                                        Ваша сакура может погибнуть, скорее помогите ей совершив любую покупку
                                    </p>
                                )}
                            </div>
                        ) : (
                            <Skeleton className="rounded-lg" isLoaded={isLoading}>
                                <div className="bg-secondary h-24 rounded-lg" />
                            </Skeleton>
                        )}
                    </div>
                    <div className="flex flex-col items-center">
                        <Achievements />
                    </div>
                </div>
            </div>
        </div>
    );
}
const getSakuraState = (user: User | null) => {
    if (!user?.lastActivity) return "bad"; // Если нет данных о последней активности

    const lastActivityDate = new Date(user.lastActivity);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 3) {
        return "good";
    } else if (diffInDays >= 3 && diffInDays < 5) {
        return "normal";
    } else {
        return "bad";
    }
};

function Achievements() {
    return (
        <div className="mx-auto max-w-5xl">
            <h1 className="mb-6 text-2xl font-bold">Достижения</h1>
            <AchievementGrid />
        </div>
    );
}
