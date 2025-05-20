"use client";

import React, { useState } from "react";

import GamesCards from "@/app/games/_components/games-cards";
import FooterElement from "@/components/Footer/footer";
import NavbarElement from "@/components/Navbar/navbar";
import { games } from "@/mocks/games";
import { PageTab } from "@/types/tabs";

export default function GamesPage() {
    const [activeTab, setActiveTab] = useState<PageTab>("games");
    return (
        <>
            <NavbarElement activeTab={activeTab} setActiveTabAction={setActiveTab} />
            <div className="container mx-auto w-full flex-1 px-1 py-8">
                <div className="grid min-h-[80vh] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <GamesCards paginatedData={games} />
                </div>
            </div>
            <FooterElement />
        </>
    );
}
