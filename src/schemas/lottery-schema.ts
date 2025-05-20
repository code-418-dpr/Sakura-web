import { z } from "zod";

export const baseSchema = z.object({
    title: z.string().min(1, "Название обязательно"),
    description: z.string().min(1, "Описание обязательно"),
    isReal: z.boolean(),
    participantsCount: z.number().min(0),
    vipParticipantsCount: z.number().min(0),
    winnersCount: z.number().min(1),
    primeWinnersCount: z.number().min(0),
    ticketPrice: z.number().min(100),
    vipDiscount: z.number().min(0.1),
    start: z.string().datetime("Некорректная дата начала"),
    end: z.string().datetime("Некорректная дата окончания"),
    rules: z.string().min(1, "Правила проведения обязательны"),
});

export const lotterySchema = baseSchema.refine((data) => new Date(data.start) < new Date(data.end), {
    message: "Дата окончания лотереи должна быть позже даты начала",
    path: ["end"],
});
