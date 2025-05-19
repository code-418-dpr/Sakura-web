"use client";

//import { useDisclosure } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

import FooterElement from "@/components/Footer/footer";
import NavbarElement from "@/components/Navbar/navbar";
import { MainCards } from "@/components/main-cards";
import { SearchCardOrDrawer } from "@/components/search-card-or-drawer";
import { Lottery } from "@/types/lottery";
import { PageTab } from "@/types/tabs";

import LotteriesCards from "./_components/lotteries-cards";
import { SearchForm } from "./_components/search-form";

interface Paged<T> {
    items: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}
export default function CatalogPage() {
    //const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [activeTab, setActiveTab] = useState<PageTab>("main");
    //const [isLotteryLoading, setIsLotteryLoading] = useState(false);
    // const { user } = useContext(AuthContext)!;
    const [isLoading] = useState(false);
    const [lotteriesData, setLotteriesData] = useState<Paged<Lottery> | null>(null);
    const [page, setPage] = useState(1);

    const perPage = 9;

    useEffect(() => {
        setLotteriesData({
            items: Array.from({ length: 14 }, (_, index) => ({
                id: `id-${index}`,
                title: `Лотерея-${index + 1}`,
                description: `Описание лотереи-${index + 1}`,
                type: "REAL",
                image: `https://avatars.mds.yandex.net/i?id=2a00000196d3064f672cf2fbc01d4b2a4812-1344766-fast-images&n=13`,
                participantsCount: 100,
                vipParticipantsCount: 10,
                winnersCount: 9,
                primeWinnersCount: 1,
                ticketPrice: 200,
                vipDiscount: 1,
                start: new Date("2025-05-14"),
                end: new Date("2025-05-25"),
                rules: "Правила лотереи",
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
        <div>
            <NavbarElement activeTab={activeTab} setActiveTabAction={setActiveTab} />
            <div className="mx-auto flex min-h-[80vh] px-6 py-6">
                <SearchCardOrDrawer>
                    <SearchForm />
                </SearchCardOrDrawer>
                <MainCards<Lottery>
                    isLoading={isLoading}
                    pageItems={animalsPageItems}
                    totalPages={totalAnimalsPages}
                    page={page}
                    setPageAction={setPage}
                    renderCardsAction={(items) => <LotteriesCards paginatedData={items} />}
                />
            </div>
            <FooterElement />
        </div>
    );
}
