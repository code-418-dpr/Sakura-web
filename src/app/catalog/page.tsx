"use client";

import React, { useState } from "react";

import FooterElement from "@/components/Footer/footer";
import NavbarElement from "@/components/Navbar/navbar";
import LotteriesView from "@/components/lotteries/lotteries-view";
import { PageTab } from "@/types/tabs";

export default function CatalogPage() {
    const [activeTab, setActiveTab] = useState<PageTab>("catalog");

    return (
        <>
            <NavbarElement activeTab={activeTab} setActiveTabAction={setActiveTab} />
            <LotteriesView />
            <FooterElement />
        </>
    );
}
