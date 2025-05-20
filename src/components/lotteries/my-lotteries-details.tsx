/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";

import { getUserLotteryById } from "@/data/lottery";
import { getLotteryPrizes } from "@/data/prize";
import { getLotteryWinnerTickets } from "@/data/ticket";
import { UsersLotteryTicket } from "@/data/userLottery";
import { useAuth } from "@/hooks/use-auth";
import { PrizeWinner, WinnerTicketUser } from "@/types/winner";
import { formatDatetime } from "@/utils";
import {
    Avatar,
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
import { TicketGame } from "./tickets-game";

 

/* eslint-disable @typescript-eslint/no-unused-vars */

interface Props {
    userId?: string;
    loteryId: string;
}
export default function MyLotteryDetails({ userId, loteryId }: Props) {
    const [lottery, setLottery] = useState<UsersLotteryTicket | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [winners, setWinners] = useState<WinnerTicketUser[]>([]);
    const [prizes, setPrizes] = useState<PrizeWinner[]>([]);
    const { user } = useAuth();
    useEffect(() => {
        const loadEvent = async () => {
            try {
                const data = (await getUserLotteryById(userId!, loteryId))!;
                setLottery(data);
                if (new Date() < new Date(data.end)) {
                    const [winnersData, prizesData] = await Promise.all([
                        getLotteryWinnerTickets(loteryId),
                        getLotteryPrizes(loteryId),
                    ]);

                    setWinners(winnersData ?? []);
                    setPrizes(prizesData ?? []);
                }
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
                <Table aria-label="Ваши билеты" className="mt-4">
                    <TableHeader>
                        <TableColumn>Номер билета</TableColumn>
                        <TableColumn>Стоимость</TableColumn>
                        {new Date() >= new Date(lottery.end) ? (
                            <>
                                <TableColumn>Статус</TableColumn>
                                <TableColumn>Приз</TableColumn>
                            </>
                        ) : (
                            <>
                                <TableColumn colSpan={1} className="text-center">
                                    Статус и приз
                                </TableColumn>
                                <TableColumn>Играть</TableColumn>
                            </>
                        )}
                    </TableHeader>

                    <TableBody>
                        {lottery.userTickets.map((ticket) => {
                            if (new Date() < new Date(lottery.end)) {
                                // Лотерея не завершилась — объединяем колонки в одну с colspan=2
                                return (
                                    <TableRow key={ticket.number}>
                                        <TableCell>#{ticket.number}</TableCell>
                                        <TableCell>{ticket.price} ₽</TableCell>
                                        <TableCell colSpan={1} className="text-center">
                                            Лотерея ещё не завершилась
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="shadow"
                                                onPress={() => {
                                                    setSelectedTicketId(String(ticket.number));
                                                    onOpen(); // Открывает модалку
                                                }}
                                            >
                                                Играть
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                            const sortedPrizes = [...lottery.prizes].sort(
                                (a, b) => b.moneyPrice - a.moneyPrice || b.pointsPrice - a.pointsPrice,
                            );
                            const prize =
                                ticket.place !== null && ticket.place <= sortedPrizes.length
                                    ? sortedPrizes[ticket.place - 1]
                                    : null;

                            return (
                                <TableRow key={ticket.number}>
                                    <TableCell>#{ticket.number}</TableCell>
                                    <TableCell>{ticket.price} ₽</TableCell>
                                    <TableCell>
                                        {ticket.place !== null ? (
                                            <Chip color="success" size="sm">
                                                Победитель
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
                {new Date() > new Date(lottery.end) && (
                    <div className="mt-8">
                        <h2 className="mb-4 text-xl font-semibold">Победители лотереи</h2>
                        <Table aria-label="Список победителей">
                            <TableHeader>
                                <TableColumn>Участник</TableColumn>
                                <TableColumn>Контакты</TableColumn>
                                <TableColumn>Выигранный приз</TableColumn>
                                <TableColumn>Место</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {winners.map((winner, index) => (
                                    <TableRow key={winner.number}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    showFallback
                                                    src="https://images.unsplash.com/broken"
                                                    name={winner.user.name}
                                                    isBordered
                                                    color="primary"
                                                    size="sm"
                                                />
                                                <span>{winner.user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{winner.user.email}</TableCell>
                                        <TableCell>{prizes[index]?.title ?? "Приз не указан"}</TableCell>
                                        <TableCell>
                                            <Chip color="success" size="sm">
                                                {index + 1} место
                                            </Chip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
                <ModalOrDrawer isOpen={isOpen} onOpenChangeAction={onOpenChange} label="Последний шанс" size="xl">
                    {selectedTicketId && (
                        <TicketGame
                            ticketId={selectedTicketId}
                            ticketPrice={
                                lottery.userTickets.find((t) => String(t.number) === selectedTicketId)?.price ?? 0
                            }
                            lotteryId={loteryId}
                            onClose={() => {
                                setSelectedTicketId(null);
                                onOpenChange(); // Закрываем модалку
                            }}
                            onTicketUpdate={async () => {
                                const updated = await getUserLotteryById(userId!, loteryId);
                                setLottery(updated);
                            }}
                        />
                    )}
                </ModalOrDrawer>
            </div>
        </>
    );
}
