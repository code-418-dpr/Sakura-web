"use client";

import { z } from "zod";

import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { createLottery } from "@/data/lottery";
import { lotterySchema } from "@/schemas/lottery-schema";
import { LotteryRequestData } from "@/types/lottery-request-data";
import { Prize } from "@/types/prize";
import { Textarea } from "@heroui/input";
import { Accordion, AccordionItem, Button, DateRangePicker, Input, Switch, cn } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone } from "@internationalized/date";

type LotteryFormData = z.infer<typeof lotterySchema>;

export default function LotteryCreateForm({ className }: React.ComponentProps<"form">) {
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [isReal, setIsReal] = useState(false);
    const [start, setStart] = useState<string>("");
    const [end, setEnd] = useState<string>("");
    const [totalCost, setTotalCost] = useState<number>(0);
    const [winChance, setWinChance] = useState<number>(0);
    const [participantsCount, setParticipantsCount] = useState<number>(0);
    const [vipParticipantsCount, setVipParticipantsCount] = useState<number>(0);
    const [winnersCount, setWinnersCount] = useState<number>(0);
    const [primeWinnersCount, setPrimeWinnersCount] = useState<number>(0);
    const [ticketPrice, setTicketPrice] = useState<number>(0);
    const [vipDiscount, setVipDiscount] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const [rules, setRules] = useState<string>("");

    const [prizes, setPrizes] = useState<Prize[]>(
        Array.from({ length: winnersCount }, () => ({ title: "", value: 0 })),
    );

    const methods = useForm<LotteryFormData>({
        resolver: zodResolver(lotterySchema),
    });

    const {
        formState: { errors },
    } = methods;

    useEffect(() => {
        setTotalCost(
            ticketPrice * (participantsCount - vipParticipantsCount) +
                ticketPrice * (1 - vipDiscount / 100) * vipParticipantsCount,
        );
    }, [ticketPrice, participantsCount, vipParticipantsCount, vipDiscount]);

    useEffect(() => {
        setWinChance(winnersCount / participantsCount);
    }, [winnersCount, participantsCount]);

    useEffect(() => {
        setPrizes(Array.from({ length: winnersCount }, () => ({ title: "", value: 0 })));
    }, [winnersCount]);

    const handlePrizeChange = (index: number, field: keyof Prize, value: string | number) => {
        setPrizes((prev) => {
            const newPrizes = [...prev];
            newPrizes[index] = {
                ...newPrizes[index],
                [field]: typeof value === "string" && field === "value" ? Number(value) : value,
            };
            return newPrizes;
        });
    };

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            setFormError(null);
            // Валидация дат
            const startDate = new Date(start);
            const endDate = new Date(end);

            if (prizes.length === 0 || !prizes.every((prize) => prize.value > 0)) {
                throw new Error("Необходимо заполнить призы для победителей");
            }

            if (isReal && !prizes.every((prize) => prize.title !== "")) {
                throw new Error("Необходимо заполнить название призов для победителей");
            }

            const totalPrizeValue = prizes.reduce((sum, prize) => sum + prize.value, 0);
            const minPrizeFund = totalCost * 0.5;
            const maxPrizeFund = totalCost * 0.7;

            if (isReal && (totalPrizeValue < minPrizeFund || totalPrizeValue > maxPrizeFund)) {
                throw new Error("Призовой фонд должен составлять 50-70% от общей суммы");
            }

            const requestData: LotteryRequestData = {
                title: title,
                description: description,
                isReal: isReal,
                participantsCount: participantsCount,
                vipParticipantsCount: vipParticipantsCount,
                winnersCount: winnersCount,
                primeWinnersCount: primeWinnersCount,
                ticketPrice: ticketPrice,
                vipDiscount: vipDiscount,
                start: startDate,
                end: endDate,
                rules: rules,
                prizes: prizes,
            };
            console.log(requestData);

            await createLottery(requestData);

            setFormError("Заявка успешно создана!");
            window.location.reload();
        } catch (error) {
            if (error instanceof Error) {
                setFormError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <form className={cn("grid items-start gap-4", className)}>
                <div className="flex flex-col gap-4">
                    <Input
                        label="Название"
                        aria-label="Название"
                        type="text"
                        variant="bordered"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                        isInvalid={!!errors.title}
                        errorMessage={errors.title?.message}
                    />

                    <div className="mb-4 flex justify-between">
                        <label>Формат лотереи:</label>
                        <Switch isSelected={isReal} onValueChange={setIsReal}>
                            {isReal ? "Реальная" : "Виртуальная"}
                        </Switch>
                    </div>

                    <div className="mb-4">
                        <DateRangePicker
                            className="w-full"
                            label="Выберите даты проведения"
                            aria-label="Выберите даты проведения"
                            onChange={(range) => {
                                if (!range) return;
                                const timeZone = getLocalTimeZone();
                                setStart(range.start.toDate(timeZone).toISOString());
                                setEnd(range.end.toDate(timeZone).toISOString());
                            }}
                        />
                    </div>

                    <Textarea
                        label="Описание лотереи"
                        aria-label="Описание лотереи"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                    />

                    <Input
                        label="Количество всех участников"
                        aria-label="Количество всех участников"
                        type="number"
                        variant="bordered"
                        value={participantsCount.toString()}
                        onChange={(e) => {
                            setParticipantsCount(Number(e.target.value));
                        }}
                    />

                    <Input
                        label="Количество VIP участников"
                        aria-label="Количество VIP участников"
                        type="number"
                        variant="bordered"
                        value={vipParticipantsCount.toString()}
                        onChange={(e) => {
                            setVipParticipantsCount(Number(e.target.value));
                        }}
                    />

                    <Input
                        label="Количество победителей"
                        type="number"
                        aria-label="Количество победителей"
                        variant="bordered"
                        value={winnersCount.toString()}
                        onChange={(e) => {
                            setWinnersCount(Number(e.target.value));
                        }}
                    />

                    <Input
                        label="Количество супер призёров"
                        type="number"
                        aria-label="Количество супер призёров"
                        variant="bordered"
                        value={primeWinnersCount.toString()}
                        onChange={(e) => {
                            setPrimeWinnersCount(Number(e.target.value));
                        }}
                    />

                    <Input
                        label="Стоимость билета"
                        type="number"
                        aria-label="Количество победителей"
                        variant="bordered"
                        value={ticketPrice.toString()}
                        onChange={(e) => {
                            setTicketPrice(Number(e.target.value));
                        }}
                    />
                    <Input
                        label="Скидка для VIP клиентов (в процентах)"
                        type="number"
                        aria-label="Скидка для VIP клиентов"
                        variant="bordered"
                        value={vipDiscount.toString()}
                        onChange={(e) => {
                            setVipDiscount(Number(e.target.value));
                        }}
                    />

                    <Textarea
                        label="Правила лотереи"
                        aria-label="Правила лотереи"
                        value={rules}
                        onChange={(e) => {
                            setRules(e.target.value);
                        }}
                    />

                    {winnersCount > 0 && (
                        <Accordion variant="bordered">
                            {prizes.map((prize, i) => (
                                <AccordionItem
                                    key={`winner-prize-${i}`}
                                    aria-label={`Победитель ${i + 1}`}
                                    title={`Победитель ${i + 1}`}
                                >
                                    {isReal && (
                                        <Input
                                            label="Название приза"
                                            type="text"
                                            aria-label="Название приза"
                                            variant="bordered"
                                            value={prize.title ?? ""}
                                            className="m-1"
                                            onChange={(e) => {
                                                handlePrizeChange(i, "title", e.target.value);
                                            }}
                                        />
                                    )}
                                    <Input
                                        label={isReal ? "Денежный эквивалент" : "Награда в игровой валюте"}
                                        type="number"
                                        aria-label="Денежный эквивалент"
                                        variant="bordered"
                                        value={prize.value.toString()}
                                        className="m-1"
                                        onChange={(e) => {
                                            handlePrizeChange(i, "value", e.target.value);
                                        }}
                                    />
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                    <p>Вероятность выигрыша: {((winChance || 0) * 100).toFixed(2)}%</p>
                    <p>
                        Чистая прибыль: {(totalCost - prizes.reduce((sum, prize) => sum + prize.value, 0)).toFixed(2)}
                    </p>

                    {formError && (
                        <div
                            className={`text-center text-sm ${
                                formError.includes("успешно") ? "text-success" : "text-danger-500"
                            }`}
                        >
                            {formError}
                        </div>
                    )}
                    <Button
                        color="success"
                        isLoading={isLoading}
                        fullWidth
                        className="mt-6"
                        onPress={() => void handleConfirm()}
                    >
                        Зарегистрировать лотерею
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
