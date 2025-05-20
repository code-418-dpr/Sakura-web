"use client";

import React, { useEffect, useState } from "react";

import { getLotteryById } from "@/data/lottery";
import { useAuth } from "@/hooks/use-auth";
import { LotteryPrizes } from "@/types/lottery";
import { formatDatetime } from "@/utils";
import {
    Button,
    Chip,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner,
    useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";

import ModalOrDrawer from "../modal-or-drawer";
import PaymentForm from "../payment-form";

interface Props {
    loteryId: string;
}
export default function LotteryDetails({ loteryId }: Props) {
    const [lottery, setLottery] = useState<LotteryPrizes | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const [totalCost, setTotalCost] = useState<number>(0);
    const [winChance, setWinChance] = useState<number>(0);
    const [showAuthModal, setShowAuthModal] = useState(false);
    useEffect(() => {
        const loadEvent = async () => {
            try {
                const data = (await getLotteryById(loteryId)) as LotteryPrizes;
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
    }, [loteryId]);

    useEffect(() => {
        if (!lottery) return;

        const { ticketPrice = 0, participantsCount = 0, vipParticipantsCount = 0, vipDiscount = 0 } = lottery;

        const regularParticipants = participantsCount - vipParticipantsCount;
        const vipTicketPrice = ticketPrice * (1 - vipDiscount / 100);

        setTotalCost(ticketPrice * regularParticipants + vipTicketPrice * vipParticipantsCount);
    }, [lottery]);

    useEffect(() => {
        if (!lottery) return;

        const { winnersCount = 0, participantsCount = 0 } = lottery;

        setWinChance(participantsCount > 0 ? winnersCount / participantsCount : 0);
    }, [lottery]);

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
                <p>Вероятность выигрыша: {(winChance * 100).toFixed(2)}%</p>
                <p>
                    Чистая прибыль:
                    {(totalCost - lottery.prizes.reduce((sum, prize) => sum + prize.moneyPrice, 0)).toLocaleString(
                        "ru-RU",
                    )}{" "}
                    ₽
                </p>
            </div>
            {user?.role !== "ADMIN" ? (
                <>
                    <Button
                        variant="solid"
                        color="success"
                        onPress={() => {
                            if (!user?.role) {
                                setShowAuthModal(true); // Неавторизованный
                            } else if (user.role === "USER") {
                                onOpen(); // Открыть оплату
                            }
                        }}
                    >
                        Купить билет
                    </Button>
                </>
            ) : (
                <></>
            )}
            <ModalOrDrawer isOpen={isOpen} onOpenChangeAction={onOpenChange} label="Детали представителя" size="xl">
                <PaymentForm onClose={onOpenChange} ticketPrice={lottery.ticketPrice} lotteryId={lottery.id} />
            </ModalOrDrawer>
            <Modal
                isOpen={showAuthModal}
                onOpenChange={() => {
                    setShowAuthModal(false);
                }}
            >
                <ModalContent>
                    <ModalHeader>Требуется авторизация</ModalHeader>
                    <ModalBody>
                        <p>Чтобы купить билет, пожалуйста, авторизуйтесь или зарегистрируйтесь.</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="light"
                            onPress={() => {
                                setShowAuthModal(false);
                            }}
                        >
                            Принять
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
