"use client";

import React, { useState } from "react";

import LotteriesTab from "@/app/admin/_components/lotteries-tab";
import UsersTab from "@/app/admin/_components/users-tab";
import NavbarElement from "@/components/Navbar/navbar";
import { PageTab } from "@/types/tabs";
import { Tab, Tabs } from "@heroui/react";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<PageTab>("main");

    return (
        <div className="mx-auto w-9/10">
            <NavbarElement activeTab={activeTab} setActiveTabAction={setActiveTab} />
            <Tabs className="mt-4" aria-label="AdminTabs" fullWidth>
                <Tab key="users" title="Пользователи">
                    <UsersTab />
                </Tab>
                <Tab key="lotteries" title="Лотериеи">
                    <LotteriesTab />
                </Tab>
            </Tabs>
        </div>
    );
}
