"use client";

import React, { useEffect, useState } from "react";

import { SearchForm } from "@/components/lotteries/search-form";
import { MainCards } from "@/components/main-cards";
import { SearchCardOrDrawer } from "@/components/search-card-or-drawer";
import { searchLotteries } from "@/data/lottery";
import { Lottery } from "@/types/lottery";
import { SearchLotteriesParams } from "@/types/lottery-item";

import LotteriesCards from "./lotteries-cards";

interface Paged<T> {
    items: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}
export default function LotteriesView() {
    const [searchParams, setSearchParams] = useState<SearchLotteriesParams>({});
    const [isLoading, setIsLoading] = useState(false);
    const [lotteriesData, setLotteriesData] = useState<Paged<Lottery> | null>(null);
    const [page, setPage] = useState(1);

    const perPage = 9;

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const result = await searchLotteries({
                    ...searchParams,
                    page,
                    pageSize: perPage,
                });

                setLotteriesData({
                    items: result.items,
                    pagination: {
                        page,
                        pageSize: perPage,
                        totalItems: result.total,
                        totalPages: Math.ceil(result.total / perPage),
                    },
                });
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void loadData();
    }, [searchParams, page]);

    const handleSearch = (params: SearchLotteriesParams) => {
        setSearchParams(params);
        setPage(1);
    };

    return (
        <div>
            <div className="mx-auto flex min-h-[80vh] px-6 py-6">
                <SearchCardOrDrawer>
                    <SearchForm onSubmit={handleSearch} />
                </SearchCardOrDrawer>
                <MainCards<Lottery>
                    isLoading={isLoading}
                    pageItems={lotteriesData?.items ?? []}
                    totalPages={lotteriesData?.pagination.totalPages ?? 1}
                    page={page}
                    setPageAction={setPage}
                    renderCardsAction={(items) => <LotteriesCards paginatedData={items} />}
                />
            </div>
        </div>
    );
}
