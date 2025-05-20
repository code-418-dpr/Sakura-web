"use client";

import React, { useEffect, useState } from "react";

import { EditProfileForm } from "@/app/user-profile/_components/edit-form";
import { ProfileTabs } from "@/app/user-profile/_components/profile-tabs";
import NavbarElement from "@/components/Navbar/navbar";
import ModalOrDrawer from "@/components/modal-or-drawer";
import PaymentFormForVIPorBalance from "@/components/payment-methods-for-vip-balance";
import { getUserByEmail } from "@/data/user";
import { useAuth } from "@/hooks/use-auth";
import { PageTab } from "@/types/tabs";
import { User } from "@/types/user";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar, Button, useDisclosure } from "@heroui/react";

import { ProfileSkeleton } from "./_components/skeleton";

export default function UserProfilePage() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isVipOpen, onOpen: onVipOpen, onOpenChange: onVipOpenChange } = useDisclosure();
    const [activeTab, setActiveTab] = useState<PageTab>("main");
    const { user } = useAuth();
    const [fullUser, setFullUser] = useState<User | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    console.log(user);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.email) {
                try {
                    const fetchedUser = await getUserByEmail(user.email);
                    setFullUser(fetchedUser);
                } catch (error) {
                    console.error("Ошибка при получении пользователя:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        void fetchUserData();
    }, [user]);

    if (isLoading || !user) {
        return <ProfileSkeleton />;
    }

    const isVipActive = fullUser?.vipDatetime ? new Date(fullUser.vipDatetime) > new Date() : false;

    return (
        <div>
            <NavbarElement activeTab={activeTab} setActiveTabAction={setActiveTab} />
            <div className="container mx-auto py-6">
                <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                    <div className="flex flex-col items-center">
                        <Card>
                            <CardBody className="flex flex-col items-center space-y-4 p-6">
                                <Avatar
                                    className="text-large h-32 w-32"
                                    src="https://ds4-sosnovoborsk-r04.gosweb.gosuslugi.ru/netcat_files/21/10/blankdirectory_3.png"
                                />
                                <div className="pt-2 text-center">
                                    <h1 className="text-2xl font-bold">{fullUser?.name}</h1>
                                    {isVipActive ? (
                                        <Chip className="mt-2" color="warning">
                                            VIP статус
                                        </Chip>
                                    ) : (
                                        <Button className="mt-2" size="md" color="warning" onPress={onVipOpen}>
                                            Купить VIP статус
                                        </Button>
                                    )}
                                </div>
                                <Button
                                    color="primary"
                                    onPress={onOpen}
                                    variant="solid"
                                    className="h-[30px]"
                                    radius={"sm"}
                                >
                                    Редактировать
                                </Button>
                                <ModalOrDrawer label="Редактировать" isOpen={isOpen} onOpenChangeAction={onOpenChange}>
                                    <EditProfileForm user={fullUser!} />
                                </ModalOrDrawer>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="flex flex-col">
                        <div className="space-y-2 pl-3">
                            <h1 className="text-3xl font-bold tracking-tight">Профиль пользователя</h1>
                        </div>
                        <div className="max-w-full">
                            <ProfileTabs user={fullUser!} />
                        </div>
                    </div>
                </div>
                <ModalOrDrawer
                    label="Оплата VIP статуса"
                    isOpen={isVipOpen}
                    onOpenChangeAction={onVipOpenChange}
                    size="xl"
                >
                    <PaymentFormForVIPorBalance onClose={onVipOpenChange} />
                </ModalOrDrawer>
            </div>
        </div>
    );
}
