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

                    if (result) {
                        const grouped = result.data.lotteries.reduce<Record<string, typeof result.data.lotteries>>(
                            (acc, item) => {
                                const id = item.id;
                                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                                if (!acc[id]) {
                                    acc[id] = [];
                                }
                                acc[id].push(item);
                                return acc;
                            },
                            {},
                        );
                        const groupedArray = Object.values(grouped).map((group) => group[0]);
                        const newResult = {
                            ...result,
                            data: {
                                ...result.data,
                                lotteries: groupedArray,
                            },
                        };

                        setUserLotteriesData(newResult);
                    }
                }
            } catch (error) {
                console.error("Loading failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void loadData();
    }, [page, userPage, user]);

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
