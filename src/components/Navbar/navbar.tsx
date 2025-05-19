"use client";

import React from "react";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import { Tab } from "@/types/tabs";
import {
    Avatar,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Image,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    PressEvent,
    Spinner,
    useDisclosure,
} from "@heroui/react";

import AuthForm from "../auth/auth-form";
import ModalOrDrawer from "../modal-or-drawer";
import { ThemeSwitcher } from "../theme-switcher";

interface NavbarProps {
    activeTab: Tab;
    setActiveTabAction: React.Dispatch<React.SetStateAction<Tab>>;
}

export default function NavbarElement({ activeTab, setActiveTabAction }: NavbarProps) {
    const tabs: Tab[] = ["features", "customers"];
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const handleNavigation = (e: PressEvent, tab: Tab) => {
        setActiveTabAction(tab);
    };

    const getTabLabel = (tab: Tab): string => {
        const labels = {
            main: "Main",
            features: "Features",
            customers: "Customers",
        } as const;

        if (tab in labels) {
            return labels[tab as keyof typeof labels];
        }
        return tab.toString();
    };
    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/");
        router.refresh();
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
                    {isLoading ? (
                        <Spinner size="sm" />
                    ) : isAuthenticated ? (
                        <NavbarItem>
                            <Dropdown shouldBlockScroll={false} showArrow>
                                <DropdownTrigger>
                                    <div className="flex cursor-pointer items-center gap-3">
                                        <Avatar
                                            showFallback
                                            src="https://images.unsplash.com/broken"
                                            isBordered
                                            color="primary"
                                            className="text-default-100"
                                            size="sm"
                                        />

                                        <div className="flex flex-col text-sm leading-tight">
                                            <span className="text-md font-medium">{user?.name}</span>
                                            <span className="text-default-600 text-md">Баланс: 00.00 руб.</span>
                                        </div>
                                    </div>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Profile Actions" variant="flat">
                                    <DropdownSection aria-label="Profile" showDivider>
                                        <DropdownItem key="profile">
                                            <Link href="/user-profile">Мой профиль</Link>
                                        </DropdownItem>
                                        <DropdownItem key="settings">Настройки</DropdownItem>
                                    </DropdownSection>
                                    <DropdownSection aria-label="Profile" showDivider>
                                        <DropdownItem key="achievments">Достижения</DropdownItem>
                                        <DropdownItem key="notifications">Уведомления</DropdownItem>
                                    </DropdownSection>
                                    <DropdownSection aria-label="Logout">
                                        <DropdownItem
                                            key="logout"
                                            color="danger"
                                            onPress={() => {
                                                handleLogout().catch(console.error);
                                            }}
                                        >
                                            Выйти
                                        </DropdownItem>
                                    </DropdownSection>
                                </DropdownMenu>
                            </Dropdown>
                        </NavbarItem>
                    ) : (
                        <NavbarItem>
                            <>
                                <Button color="primary" variant="flat" onPress={onOpen}>
                                    Войти
                                </Button>
                                <ModalOrDrawer label="Авторизация" isOpen={isOpen} onOpenChangeAction={onOpenChange}>
                                    <AuthForm />
                                </ModalOrDrawer>
                            </>
                        </NavbarItem>
                    )}
                    <NavbarItem>
                        <ThemeSwitcher />
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </>
    );
}
