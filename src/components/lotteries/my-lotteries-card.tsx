"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";

import { useState } from "react";

import ModalOrDrawer from "@/components/modal-or-drawer";
import { UserLotteryData } from "@/data/userLottery";
import { Card, CardBody, Image, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";

import LotteryDetails from "./lotteries-details";

interface Props {
    paginatedData: UserLotteryData["lotteries"][number][];
}

export default function MyLotteriesCards({ paginatedData }: Props) {
    const [selected, setSelected] = useState<string | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleClick = (id: string) => {
        setSelected(id);
        onOpen();
    };

    return (
        <>
            {selected && (
                <ModalOrDrawer
                    label="Подробная информация"
                    isOpen={isOpen}
                    onOpenChangeAction={onOpenChange}
                    size="3xl"
                >
                    <LotteryDetails loteryId={selected} />
                </ModalOrDrawer>
            )}
            {paginatedData.map((e) => {
                const start = format(new Date(e.start), "dd.MM.yyyy", { locale: ru });
                const end = format(new Date(e.end), "dd.MM.yyyy", { locale: ru });

                return (
                    <div
                        key={e.id}
                        onClick={() => {
                            handleClick(e.id);
                        }}
                    >
                        <Card
                            className="cursor-pointer transition-shadow hover:shadow-lg"
                            onPress={() => {
                                handleClick(e.id);
                            }}
                        >
                            <CardBody className="space-y-4">
                                <Image alt={e.title} src="placeholder.jpg" className="w-full rounded-xl object-cover" />
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">{e.title}</h3>

                                    <div className="flex items-center pt-2">
                                        <p className="mx-2 text-sm font-bold">Даты проведения:</p>
                                        <p>
                                            {start} — {end}
                                        </p>
                                    </div>

                                    <div className="flex items-center pt-2">
                                        <Icon icon="fluent:animal-cat-16-regular" className="h-5 w-5" />
                                        <p className="mx-2 text-sm font-bold">
                                            Тип:
                                            <span className="text-foreground/50 m-1">
                                                {e.type === "REAL" ? "Реальная" : "Виртуальная"}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                );
            })}
        </>
    );
}
