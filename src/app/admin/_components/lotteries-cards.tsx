"use client";

import { useState } from "react";

import ModalOrDrawer from "@/components/modal-or-drawer";
import { LotteryItem } from "@/types/lottery-item";
import { Chip } from "@heroui/chip";
import { Card, CardBody, Image, useDisclosure } from "@heroui/react";

interface Props {
    paginatedData: LotteryItem[];
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
                <ModalOrDrawer label="Лотерея" isOpen={isOpen} onOpenChangeAction={onOpenChange} size="3xl">
                    <p>Подробности пока не доступны</p>
                </ModalOrDrawer>
            )}
            {paginatedData.map((e) => {
                return (
                    <div
                        key={e.id}
                        onClick={() => {
                            handleClick(e.id);
                        }}
                    >
                        <Card
                            key={e.id}
                            className="cursor-pointer transition-shadow hover:shadow-lg"
                            onPress={() => {
                                handleClick(e.id);
                            }}
                        >
                            <CardBody className="space-y-4">
                                <Image alt={e.name} src={e.image} className="w-full rounded-xl object-cover" />
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">{e.name}</h3>
                                    <div className="flex items-center pt-2">
                                        <p className="mx-2 text-sm font-bold">Даты проведения: </p>
                                        <p>
                                            {e.startDate} - {e.endDate}
                                        </p>
                                    </div>
                                    <div className="flex items-center pt-2">
                                        <p className="mx-2 text-sm font-bold">Призовой фонд: </p>
                                        <p>{e.prize.toLocaleString("ru-RU")} ₽</p>
                                    </div>
                                    <div className="flex items-center pt-2">
                                        <p className="mx-2 text-sm font-bold">
                                            Тип проведения:
                                            <Chip className="mx-2" color={e.isVirtual ? "success" : "danger"}>
                                                {e.isVirtual ? "Реальная" : "Виртуальная"}
                                            </Chip>
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
