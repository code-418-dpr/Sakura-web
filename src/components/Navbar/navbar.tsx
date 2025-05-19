"use client";

import React from "react";

import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import { PageTab } from "@/types/tabs";
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
import { Icon } from "@iconify/react/dist/iconify.js";

import AuthForm from "../auth/auth-form";
import ModalOrDrawer from "../modal-or-drawer";
import { ThemeSwitcher } from "../theme-switcher";

interface NavbarProps {
    activeTab: PageTab;
    setActiveTabAction: React.Dispatch<React.SetStateAction<PageTab>>;
}

export default function NavbarElement({ activeTab, setActiveTabAction }: NavbarProps) {
    const tabs: PageTab[] = ["catalog"];
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleNavigation = (e: PressEvent, tab: PageTab) => {
        setActiveTabAction(tab);
    };

    const getTabLabel = (tab: PageTab): string => {
        const labels = {
            catalog: "Каталог",
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
                    {pathname !== "/" && (
                        <NavbarItem key="main">
                            <Link
                                color="foreground"
                                href="/"
                                onPressEnd={(e: PressEvent) => {
                                    handleNavigation(e, "main");
                                }}
                            >
                                Главная
                            </Link>
                        </NavbarItem>
                    )}
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
                        <>
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
                                                <span className="text-default-600 text-md">
                                                    {user?.realBalance}&nbsp;
                                                    <span className="inline-block align-middle">₽</span> |{" "}
                                                    {user?.virtualBalance}&nbsp;
                                                    <span className="inline-block align-middle text-xs">
                                                        <Icon icon="iconoir:leaf" width="16" height="16" />
                                                    </span>
                                                </span>
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
                        </>
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
