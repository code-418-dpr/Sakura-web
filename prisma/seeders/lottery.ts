import { Prisma } from "@/app/generated/prisma";
import { createLottery, getLotteryByTitle } from "@/data/lottery";
import { LotteryRequestData } from "@/types/lottery-request-data";

const LOTTERIES: Prisma.LotteryCreateInput[] = [
    ...Array(10)
        .fill(undefined)
        .map((_, i) => {
            const startDate = new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
            const endDate = new Date(startDate.getTime() + Math.floor(Math.random() * 14 + 1) * 24 * 60 * 60 * 1000);
            return {
                title: `Лотерея ${i + 1}`,
                description: `Описание лотереи ${i + 1}`,
                isReal: !!Math.round(Math.random()),
                participantsCount: Math.floor(Math.random() * 1000 + 100),
                vipParticipantsCount: Math.floor(Math.random() * 100 + 10),
                winnersCount: Math.floor(Math.random() * 5 + 1),
                primeWinnersCount: Math.floor(Math.random() * 5 + 1),
                ticketPrice: Math.floor(Math.random() * 100 + 10),
                vipDiscount: Math.floor(Math.random() * 10 + 1),
                start: startDate,
                end: endDate,
                rules: `Правила лотереи ${i + 1}`,
            };
        }),
];

export async function seedLotteries() {
    for (const {
        title,
        description,
        isReal,
        participantsCount,
        vipParticipantsCount,
        winnersCount,
        primeWinnersCount,
        ticketPrice,
        vipDiscount,
        start,
        end,
        rules,
    } of LOTTERIES) {
        if (!(await getLotteryByTitle(title))) {
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
                start: start as Date,
                end: end as Date,
                rules: rules,
            };
            await createLottery(requestData);
        }
    }
}
