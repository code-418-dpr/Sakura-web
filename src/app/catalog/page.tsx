"use client";

//import { useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";

import FooterElement from "@/components/Footer/footer";
import NavbarElement from "@/components/Navbar/navbar";
import { MainCards } from "@/components/main-cards";
import { SearchCardOrDrawer } from "@/components/search-card-or-drawer";
import { searchLotteries } from "@/data/lottery";
import { Lottery } from "@/types/lottery";
import { SearchLotteriesParams } from "@/types/lottery-item";
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
                console.log(result.items);
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
            <NavbarElement activeTab={activeTab} setActiveTabAction={setActiveTab} />
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
            <FooterElement />
        </div>
    );
}
