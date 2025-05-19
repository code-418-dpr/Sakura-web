"use client";

import React from "react";

import LotteryCreateForm from "@/app/admin/_components/lotteries/lottery-create-form";
import LotteriesView from "@/components/lotteries/lotteries-view";
import ModalOrDrawer from "@/components/modal-or-drawer";
import { Button, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function LotteriesTab() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <div className="flex min-h-[100vh] w-full">
                <div className="flex-1 p-4">
                    <LotteriesView />
                    <div>
                        <div className="absolute">
                            <Button
                                className="fixed right-5 bottom-5 z-10"
                                isIconOnly
                                aria-label="Create"
                                onPress={onOpen}
                                size="lg"
                            >
                                <Icon icon="iconoir:plus" width={50} height={50} />
                            </Button>
                        </div>
                        <ModalOrDrawer label="Создание лотереи" isOpen={isOpen} onOpenChangeAction={onOpenChange}>
                            <LotteryCreateForm />
                        </ModalOrDrawer>
                    </div>
                </div>
            </div>
        </>
    );
}
