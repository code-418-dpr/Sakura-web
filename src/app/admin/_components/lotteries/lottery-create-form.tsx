"use client";

import { z } from "zod";

import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { lotterySchema } from "@/schemas/lottery-schema";
import { LotteryRequestData } from "@/types/lottery-request-data";
import { Textarea } from "@heroui/input";
import { Button, DateRangePicker, Input, Switch, cn } from "@heroui/react";
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
    const [participantsCount, setParticipantsCount] = useState<number>(0);
    const [vipParticipantsCount, setVipParticipantsCount] = useState<number>(0);
    const [winnersCount, setWinnersCount] = useState<number>(0);
    const [primeWinnersCount, setPrimeWinnersCount] = useState<number>(0);
    const [ticketPrice, setTicketPrice] = useState<number>(0);
    const [vipDiscount, setVipDiscount] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const [rules, setRules] = useState<string>("");

    const methods = useForm<LotteryFormData>({
        resolver: zodResolver(lotterySchema),
    });

    const {
        formState: { errors },
    } = methods;

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            setFormError(null);
            // Валидация дат
            const startDate = new Date(start);
            const endDate = new Date(end);

            const requestData: LotteryRequestData = {
                title,
                description,
                isReal,
                start: startDate,
                end: endDate,
                participantsCount: participantsCount,
                vipParticipantsCount: vipParticipantsCount,
                winnersCount: winnersCount,
                primeWinnersCount: primeWinnersCount,
                ticketPrice: ticketPrice,
                vipDiscount: vipDiscount,
                rules: rules,
            };
            console.log(requestData);
            await new Promise((resolve) => setTimeout(resolve, 500));

            // await createLotteryRequest(requestData);

            setFormError("Заявка успешно создана!");
        } catch (error) {
            if (error instanceof Error) {
                setFormError(error.message);
                console.error("Ошибка:", error);
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
                        label="Количество обычных участников"
                        aria-label="Количество обычных участников"
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
                        label="Максимальное количество команд"
                        aria-label="Максимальное количество команд"
                        type="number"
                        variant="bordered"
                        value={winnersCount.toString()}
                        onChange={(e) => {
                            setWinnersCount(Number(e.target.value));
                        }}
                    />
                    <Input
                        label="Количество победителей"
                        type="number"
                        aria-label="Количество победителей"
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
