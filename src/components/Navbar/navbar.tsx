"use client";

import React, { useState } from "react";

import { Tab } from "@/types/tabs";
import { Button, Image, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, PressEvent } from "@heroui/react";

import { ThemeSwitcher } from "../theme-switcher";
import ModalAuth from "./modal-auth";

interface NavbarProps {
    activeTab: Tab;
    setActiveTabAction: React.Dispatch<React.SetStateAction<Tab>>;
}

export default function NavbarElement({ activeTab, setActiveTabAction }: NavbarProps) {
    const tabs: Tab[] = ["features", "customers", "integrations"];
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const handleNavigation = (e: PressEvent, tab: Tab) => {
        setActiveTabAction(tab);
    };

    const getTabLabel = (tab: Tab): string => {
        const labels = {
            main: "Main",
            features: "Features",
            customers: "Customers",
            integrations: "Integrations",
        } as const;

        if (tab in labels) {
            return labels[tab as keyof typeof labels];
        }
        return tab.toString();
    };

    return (
        <>
            <Navbar>
                <NavbarBrand className="gap-x-4">
                    <Image alt="Sakura Logo" src="sakura.png" width={32} height={32} />
                    <p className="font-bold text-inherit">SAKURA</p>
                </NavbarBrand>
                <NavbarContent className="hidden gap-4 sm:flex" justify="center">
                    {tabs.map((tab) => (
                        <NavbarItem key={tab}>
                            <Link
                                color="foreground"
                                href={`/${tab}`}
                                onPressEnd={(e: PressEvent) => {
                                    handleNavigation(e, tab);
                                }}
                                className={activeTab === tab ? "font-bold" : ""}
                            >
                                {getTabLabel(tab)}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button
                            color="primary"
                            variant="flat"
                            onPress={() => {
                                setIsAuthOpen(true);
                            }}
                        >
                            Войти
                        </Button>
                    </NavbarItem>
                    <NavbarItem>
                        <ThemeSwitcher />
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <ModalAuth isOpen={isAuthOpen} onOpenChangeAction={setIsAuthOpen} />
        </>
    );
}
