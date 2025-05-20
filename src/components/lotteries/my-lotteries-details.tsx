/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";

import { getUserLotteryById } from "@/data/lottery";
import { UsersLotteryTicket } from "@/data/userLottery";
import { useAuth } from "@/hooks/use-auth";
import { formatDatetime } from "@/utils";
import {
    Button,
    Chip,
    Image,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";

import ModalOrDrawer from "../modal-or-drawer";
import PaymentForm from "../payment-form";

/* eslint-disable @typescript-eslint/no-unused-vars */

interface Props {
    userId?: string;
    loteryId: string;
}
export default function MyLotteryDetails({ userId, loteryId }: Props) {
    const [lottery, setLottery] = useState<UsersLotteryTicket | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    useEffect(() => {
        const loadEvent = async () => {
            try {
                const data = (await getUserLotteryById(userId!, loteryId))!;
                setLottery(data);
            } catch {
                setError("Не удалось загрузить данные о событии.");
            } finally {
                setLoading(false);
            }
        };

        if (loteryId) {
            void loadEvent();
        }
    }, [loteryId, userId]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error || !lottery) {
        return <div className="text-danger-500 py-8 text-center">{error ?? "Событие не найдено"}</div>;
    }
    return (
        <>
            <div className="flex items-center justify-between pt-2">
                <h3 className="text-xl font-bold">{lottery.title}</h3>
                <Chip color="secondary" variant="flat">
                    {lottery.type == "REAL" ? "Настоящая лотерея" : "Виртуальная лотерея"}
                </Chip>
            </div>
            <div className="grid grid-cols-2">
                <Image
                    alt={lottery.title}
                    src={lottery.image ?? "placeholder.jpg"}
                    className="w-[80%] rounded-xl object-cover"
                />
                <div className="grid grid-cols-1">
                    <p className="text-md -translate-x-10">{lottery.description}</p>
                    <p className="text-foreground/50 -translate-x-10 text-sm font-bold">
                        Квота участников: {lottery.participantsCount}
                    </p>
                    <p className="text-foreground/50 -translate-x-10 text-sm font-bold">
                        Квота VIP-участников: {lottery.vipParticipantsCount}
                    </p>
                    <p className="text-foreground/50 -translate-x-10 text-sm font-bold">
                        Скидка для VIP: {lottery.vipDiscount}%
                    </p>
                    <div className="grid -translate-x-10 grid-cols-2 space-y-2">
                        <p className="left col-span-2 pt-1 text-sm">
                            Начало:
                            <span className="text-foreground/50 ml-1 -translate-x-10 text-sm">
                                {formatDatetime(lottery.start)}
                            </span>
                            <br />
                            Конец:
                            <span className="text-foreground/50 ml-1 -translate-x-10 text-sm">
                                {formatDatetime(lottery.end)}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 space-y-2">
                {/* Region */}
                <div className="flex items-start gap-2">
                    <p className="min-w-[60px] pt-1 text-sm">Призы:</p>
                    <div className="flex flex-1 justify-end">
                        <div className="flex flex-wrap justify-end gap-2">
                            {lottery.prizes.map((prize) => (
                                <Chip
                                    key={prize.id}
                                    size="sm"
                                    color="success"
                                    variant="solid"
                                    className="whitespace-nowrap"
                                >
                                    {prize.title}
                                </Chip>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 space-y-2">
                <p className="text-lg">Правила игры:</p>
                <p>{lottery.rules}</p>
                <p color="success">
                    Стоимость: {lottery.ticketPrice} ₽ ({(lottery.ticketPrice * 1.1).toFixed(2)}{" "}
                    <span className="inline-block align-middle text-xs">
                        <Icon icon="iconoir:leaf" width="16" height="16" />
                    </span>
                    )
                </p>
            </div>
            <div className="">
                <h1 className="text-center text-xl">Ваши билеты</h1>
                {new Date() > new Date(lottery.end) ? (
                    <div className="text-foreground/50 text-center">Лотерея ещё не завершилась</div>
                ) : (
                    <Table aria-label="Ваши билеты" className="mt-4">
                        <TableHeader>
                            <TableColumn>Номер билета</TableColumn>
                            <TableColumn>Стоимость</TableColumn>
                            <TableColumn>Статус</TableColumn>
                            <TableColumn>Приз</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {lottery.userTickets.map((ticket) => {
                                const prize =
                                    ticket.place !== null ? lottery.prizes.find((p) => p.id === lottery.id) : null;

                                return (
                                    <TableRow key={ticket.number}>
                                        <TableCell>#{ticket.number}</TableCell>
                                        <TableCell>{ticket.price} ₽</TableCell>
                                        <TableCell>
                                            {ticket.place !== null ? (
                                                <Chip color="success" size="sm">
                                                    Победитель ({ticket.place} место)
                                                </Chip>
                                            ) : (
                                                <Chip color="default" size="sm">
                                                    Не выиграл
                                                </Chip>
                                            )}
                                        </TableCell>
                                        <TableCell>{prize?.title ?? "Вы ничего не выиграли"}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
                {new Date() < new Date(lottery.end) && (
                    <div>
                        <h1>Выиграли в лотереи</h1>
                    </div>
                )}
            </div>
        </>
    );
}
