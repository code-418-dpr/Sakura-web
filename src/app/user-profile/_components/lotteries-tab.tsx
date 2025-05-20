"use client";

import React, { useEffect, useState } from "react";

import MyLotteriesCards from "@/components/lotteries/my-lotteries-card";
import { MainCards } from "@/components/main-cards";
import { PaginatedResult, getUserLotteryData } from "@/data/lottery";
import { UserLotteryData } from "@/data/userLottery";
import { useAuth } from "@/hooks/use-auth";

export default function LotteriesTab() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [userLotteriesData, setUserLotteriesData] = useState<PaginatedResult<UserLotteryData> | null>(null);
    const [page] = useState(1);
    const [userPage, setUserPage] = useState(1);
    const [activeTab] = useState<"all" | "my">("all");

    const perPage = 9;

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                if (user) {
                    const result = await getUserLotteryData(user.id, {
                        page: userPage,
                        pageSize: perPage,
                    });
                    console.log("test: ", result);
                    if (result) {
                        setUserLotteriesData(result);
                    }
                }
            } catch (error) {
                console.error("Loading failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void loadData();
    }, [page, userPage, activeTab, user]);

    return (
        <div>
            <div className="mx-auto flex px-6 py-6">
                <MainCards<UserLotteryData["lotteries"][number]>
                    isLoading={isLoading}
                    pageItems={userLotteriesData?.data.lotteries ?? []}
                    totalPages={userLotteriesData?.pagination.totalPages ?? 1}
                    page={userPage}
                    setPageAction={setUserPage}
                    renderCardsAction={(items) => <MyLotteriesCards paginatedData={items} />}
                />
            </div>
        </div>
    );
}
