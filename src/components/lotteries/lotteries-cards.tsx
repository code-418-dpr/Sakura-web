"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";

import { useState } from "react";

import ModalOrDrawer from "@/components/modal-or-drawer";
import { Lottery } from "@/types/lottery";
import { Card, CardBody, Image, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";

import LotteryDetails from "./lotteries-details";

interface Props {
    paginatedData: Lottery[];
}

export default function LotteriesCards({ paginatedData }: Props) {
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
                                <Image
                                    alt={e.title}
                                    src="https://avatars.mds.yandex.net/i?id=2a00000196d3064f672cf2fbc01d4b2a4812-1344766-fast-images&n=13"
                                    className="w-full rounded-xl object-cover"
                                />
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">{e.title}</h3>

                                    <div className="flex items-center pt-2">
                                        <p className="mx-2 text-sm font-bold">Даты проведения:</p>
                                        <p>
                                            {start} — {end}
                                        </p>
                                    </div>

                                    <div className="flex items-center pt-2">
                                        <p className="mx-2 text-sm font-bold">Стоимость билета:</p>
                                        <p>{e.ticketPrice.toFixed(2)} ₽</p>
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

                                    <div className="text-default-600 flex items-center gap-3 pt-2 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Icon icon="mdi:account-group-outline" className="h-4 w-4" />
                                            {e.participantsCount} участников
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Icon icon="mdi:crown-outline" className="h-4 w-4" />
                                            {e.winnersCount} победителей
                                        </div>
                                    </div>

                                    {e.vipDiscount > 0 && (
                                        <div className="flex items-center pt-2 text-xs text-amber-600">
                                            <Icon icon="mdi:star-circle-outline" className="mr-1 h-4 w-4" />
                                            Скидка для VIP: {e.vipDiscount}%
                                        </div>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                );
            })}
        </>
    );
}
