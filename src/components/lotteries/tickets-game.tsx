"use client";

import { AnimatePresence, motion } from "framer-motion";

import { useEffect, useState } from "react";

import { createTicket, deleteTicket } from "@/data/ticket";
import { updateUser } from "@/data/user";
import { useAuth } from "@/hooks/use-auth";
import { Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface TicketGameProps {
    ticketId: string;
    ticketPrice: number;
    lotteryId: string;
    onClose: () => void;
    onTicketUpdate: () => Promise<void>;
}

type TicketType = "main_prize" | "bonus" | "empty" | "destroy";

interface GameTicket {
    id: number;
    type: TicketType;
    isFlipped: boolean;
}

const ticketContents = {
    main_prize: {
        icon: "mdi:ticket",
        text: "Вы выиграли дополнительный билет!",
        color: "bg-purple-500",
    },
    bonus: {
        icon: "iconoir:leaf",
        text: "Бонус +25% от стоимости к бонусам!",
        color: "bg-green-500",
    },
    empty: {
        icon: "mdi:empty",
        text: "Пусто... Повезёт в следующий раз!",
        color: "bg-gray-500",
    },
    destroy: {
        icon: "mdi:fire",
        text: "Билет сгорел!",
        color: "bg-red-500",
    },
};

export const TicketGame = ({ ticketId, ticketPrice, lotteryId, onClose, onTicketUpdate }: TicketGameProps) => {
    const { user, update: updateAuth } = useAuth();
    const [tickets, setTickets] = useState<GameTicket[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Инициализация билетов с явным типизированием
    useEffect(() => {
        const initialTypes: TicketType[] = ["main_prize", "bonus", "empty", ...Array<TicketType>(3).fill("destroy")];

        const shuffled = initialTypes
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

        setTickets(
            shuffled.map((type, i) => ({
                id: i,
                type,
                isFlipped: false,
            })),
        );
    }, []);

    const handleTicketClick = async (id: number) => {
        if (isProcessing || selectedId !== null) return;

        setSelectedId(id);
        setIsProcessing(true);

        const selectedTicket = tickets.find((t) => t.id === id)!;
        setTickets(tickets.map((t) => (t.id === id ? { ...t, isFlipped: true } : t)));

        try {
            switch (selectedTicket.type) {
                case "main_prize":
                    setResult(ticketContents.main_prize.text);
                    await createTicket(user!.id, lotteryId, ticketPrice);
                    break;

                case "bonus": {
                    const bonus = ticketPrice * 0.25;
                    await updateUser(user!.id, Number(user!.realBalance), Number(user!.virtualBalance) + bonus);
                    await updateAuth();
                    setResult(ticketContents.bonus.text);
                    break;
                }

                case "destroy":
                    setResult(ticketContents.destroy.text);
                    await deleteTicket(ticketId);
                    break;

                default:
                    setResult(ticketContents.empty.text);
                    break;
            }
        } catch (error) {
            setResult("Ошибка обработки результата");
            console.error("Ошибка:", error);
        }

        // Обработка закрытия с обработкой ошибок
        setTimeout(() => {
            void (async () => {
                try {
                    await onTicketUpdate();
                } catch (error) {
                    console.error("Ошибка при обновлении билетов:", error);
                } finally {
                    onClose();
                }
            })();
        }, 5000);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-xl p-6">
                <h2 className="mb-4 text-center text-xl font-bold">Выберите один билет</h2>
                <div className="bg-primary mb-6 rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                        <Icon icon="mdi:information" className="mt-0.5 text-xl" />
                        <div>
                            <h3 className="mb-2 font-semibold">Правила игры</h3>
                            <ul className="list-disc space-y-2 pl-4 text-sm">
                                <li>Вы выбираете один билет из шести</li>
                                <li>
                                    Возможные результаты:
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        <Chip size="sm" color="success" variant="dot">
                                            +1 билет
                                        </Chip>
                                        <Chip size="sm" color="warning" variant="dot">
                                            +25% бонусов
                                        </Chip>
                                        <Chip size="sm" color="default" variant="dot">
                                            Пусто
                                        </Chip>
                                        <Chip size="sm" color="danger" variant="dot">
                                            Уничтожение билета
                                        </Chip>
                                    </div>
                                </li>
                                <li>После выбора билета остальные блокируются</li>
                                <li>Результат автоматически сохраняется через 5 секунд</li>
                                <li className="font-medium text-red-600">
                                    Риски: Есть вероятность потерять текущий билет
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mb-6 grid grid-cols-3 gap-4">
                    {tickets.map((ticket) => (
                        <motion.div
                            key={ticket.id}
                            className="relative aspect-square cursor-pointer"
                            onClick={() => void handleTicketClick(ticket.id)}
                            whileHover={!isProcessing ? { scale: 1.05 } : undefined}
                            animate={ticket.isFlipped ? { rotateY: 180 } : {}}
                            transition={{ duration: 0.6 }}
                            style={{ perspective: 1000 }}
                        >
                            <div className="absolute h-full w-full">
                                {!ticket.isFlipped ? (
                                    <div className="bg-primary flex h-full w-full items-center justify-center rounded-lg">
                                        <Icon icon="mdi:ticket-outline" className="text-4xl text-white" />
                                    </div>
                                ) : (
                                    <div
                                        className={`${ticketContents[ticket.type].color} flex h-full w-full rotate-y-180 flex-col items-center justify-center rounded-lg p-4`}
                                    >
                                        <Icon
                                            icon={ticketContents[ticket.type].icon}
                                            className="mb-2 text-4xl text-white"
                                        />
                                        <span className="text-center text-sm text-white">
                                            {ticketContents[ticket.type].text}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 text-center"
                        >
                            <p className="text-lg font-semibold">{result}</p>
                            <p className="text-gray-600">Закрытие через 5 секунд...</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-center">
                    <Button variant="flat" onPress={onClose} disabled={isProcessing}>
                        Закрыть
                    </Button>
                </div>
            </div>
        </div>
    );
};
