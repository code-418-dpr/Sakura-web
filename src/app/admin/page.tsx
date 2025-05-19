"use client";

import React, { useState } from "react";

import LotteriesTab from "@/app/admin/_components/lotteries/lotteries-tab";
import UsersTab from "@/app/admin/_components/users-tab";
import FooterElement from "@/components/Footer/footer";
import NavbarElement from "@/components/Navbar/navbar";
import { PageTab } from "@/types/tabs";
import { Tab, Tabs } from "@heroui/react";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<PageTab>("main");

    return (
        <div className="mx-2">
            <NavbarElement activeTab={activeTab} setActiveTabAction={setActiveTab} />
            <div className="min-h-[80vh]">
                <Tabs className="mt-4" aria-label="AdminTabs" fullWidth>
                    <Tab key="users" title="Пользователи">
                        <UsersTab />
                    </Tab>
                    <Tab key="lotteries" title="Лотериеи">
                        <LotteriesTab />
                    </Tab>
                </Tabs>
            </div>
            <FooterElement />
        </div>
    );
}
