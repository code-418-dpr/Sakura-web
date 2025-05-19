"use client";

import React, { useEffect, useMemo, useState } from "react";

import LotteriesCards from "@/app/admin/_components/lotteries/lotteries-cards";
import LotteryCreateForm from "@/app/admin/_components/lotteries/lottery-create-form";
import { MainCards } from "@/components/main-cards";
import ModalOrDrawer from "@/components/modal-or-drawer";
import { LotteryItem } from "@/types/lottery-item";
import { Button, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Paged<T> {
    items: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

export default function LotteriesTab() {
    const [isLoading] = useState(false);
    const [lotteriesData, setLotteriesData] = useState<Paged<LotteryItem> | null>(null);
    const [page, setPage] = useState(1);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const perPage = 9;

    useEffect(() => {
        setLotteriesData({
            items: Array.from({ length: 14 }, (_, index) => ({
                id: `id-${index}`,
                name: `Лотерея-${index + 1}`,
                image: `https://avatars.mds.yandex.net/i?id=2a00000196d3064f672cf2fbc01d4b2a4812-1344766-fast-images&n=13`,
                startDate: "14.05.2025",
                endDate: "18.05.2025",
                isVirtual: index % 2 === 0,
                prize: 140000,
            })),
            pagination: {
                page,
                pageSize: perPage,
                totalItems: 14,
                totalPages: 2,
            },
        });
    }, [page]);

    const animalsPageItems = useMemo(() => {
        if (!lotteriesData) return [];
        const start = (page - 1) * lotteriesData.pagination.pageSize;
        const end = start + lotteriesData.pagination.pageSize;

        return lotteriesData.items.slice(start, end);
    }, [page, lotteriesData]);

    const totalAnimalsPages = lotteriesData?.pagination.totalPages ?? 1;

    return (
        <>
            <div className="flex min-h-[100vh] w-full">
                <div className="flex-1 p-4">
                    <MainCards<LotteryItem>
                        isLoading={isLoading}
                        pageItems={animalsPageItems}
                        totalPages={totalAnimalsPages}
                        page={page}
                        setPageAction={setPage}
                        renderCardsAction={(items) => <LotteriesCards paginatedData={items} />}
                    />
                    <div>
                        <div className="absolute">
                            <Button
                                className="fixed right-5 bottom-5 z-10"
                                isIconOnly
                                aria-label="Create"
                                onPress={onOpen}
                                size="lg"
                            >
                                <Icon icon="iconoir:plus" width={50} height={50} />
                            </Button>
                        </div>
                        <ModalOrDrawer label="Создание лотереи" isOpen={isOpen} onOpenChangeAction={onOpenChange}>
                            <LotteryCreateForm />
                        </ModalOrDrawer>
                    </div>
                </div>
            </div>
        </>
    );
}
