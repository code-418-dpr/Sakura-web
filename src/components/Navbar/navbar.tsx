"use client";

import React from "react";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

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
import PaymentFormForVIPorBalance from "../payment-methods-for-vip-balance";
import { ThemeSwitcher } from "../theme-switcher";

interface NavbarProps {
    activeTab: PageTab;
    setActiveTabAction: React.Dispatch<React.SetStateAction<PageTab>>;
}

export default function NavbarElement({ activeTab, setActiveTabAction }: NavbarProps) {
    const { isOpen: isAuthOpen, onOpen: onAuthOpen, onOpenChange: onAuthOpenChange } = useDisclosure();
    const { isOpen: isReferalOpen, onOpen: onReferalOpen, onOpenChange: onReferalOpenChange } = useDisclosure();
    const { isOpen: isBalanceOpen, onOpen: onBalanceOpen, onOpenChange: onBalanceOpenChange } = useDisclosure();
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    const handleNavigation = (e: PressEvent, tab: PageTab) => {
        setActiveTabAction(tab);
    };

    const tabs: PageTab[] = React.useMemo(() => {
        const baseTabs: PageTab[] = ["sakura", "games", "score"];
        if (user?.role === "ADMIN") {
            return ["admin", ...baseTabs];
        }
        return ["catalog", ...baseTabs];
    }, [user?.role]);

    const getTabLabel = (tab: PageTab): string => {
        const labels = {
            catalog: "Лотереи",
            sakura: "Сакура",
            games: "Игры",
            admin: "Админ Панель",
            score: "Рейтинг",
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
                    <Link
                        color="foreground"
                        href="/"
                        onPressEnd={(e: PressEvent) => {
                            handleNavigation(e, "main");
                        }}
                    >
                        <Image alt="Sakura Logo" src="sakura.png" width={32} height={32} />
                        <p className="font-bold text-inherit">SAKURA</p>
                    </Link>
                </NavbarBrand>
                <NavbarContent className="hidden gap-4 sm:flex" justify="center">
                    {tabs.map((tab) => (
                        <NavbarItem key={tab}>
                            <Link
                                hidden={!isAuthenticated && getTabLabel(tab) !== "Лотереи"}
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
                                                color={user?.isVip ? "primary" : "warning"}
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
                                            <DropdownItem key="settings" onPress={onBalanceOpen}>
                                                Пополнить баланс
                                            </DropdownItem>
                                        </DropdownSection>
                                        <DropdownSection aria-label="Profile" showDivider>
                                            <DropdownItem key="achievments">Достижения</DropdownItem>
                                            <DropdownItem key="notifications">Уведомления</DropdownItem>
                                            <DropdownItem key="invite" onPress={onReferalOpen}>
                                                Пригласить друга
                                            </DropdownItem>
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
                            <ModalOrDrawer
                                label="Реферальный код"
                                isOpen={isReferalOpen}
                                onOpenChangeAction={onReferalOpenChange}
                                size="2xl"
                            >
                                <p>Ваш реферальный код: {user?.id ?? ""}</p>
                            </ModalOrDrawer>
                        </>
                    ) : (
                        <NavbarItem>
                            <>
                                <Button color="primary" variant="flat" onPress={onAuthOpen}>
                                    Войти
                                </Button>
                                <ModalOrDrawer
                                    label="Авторизация"
                                    isOpen={isAuthOpen}
                                    onOpenChangeAction={onAuthOpenChange}
                                >
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
            <ModalOrDrawer
                label="Пополнить баланс"
                isOpen={isBalanceOpen}
                onOpenChangeAction={onBalanceOpenChange}
                size="xl"
            >
                <PaymentFormForVIPorBalance onClose={onBalanceOpenChange} isBalance={true} />
            </ModalOrDrawer>
        </>
    );
}
