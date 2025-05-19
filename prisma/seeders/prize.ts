import { Prisma } from "@/app/generated/prisma";
import { getLotteryAll } from "@/data/lottery";
import { createPrize, getPrizeByTitle } from "@/data/prize";

const PRIZES: Prisma.PrizeUncheckedCreateInput[] = [];

const lotteries = await getLotteryAll();
for (const lottery of lotteries) {
    PRIZES.push({
        title: `Праз ${lotteries.length + 1}`,
        lotteryId: lottery.id,
        moneyPrice: Math.floor(Math.random() * 1000 + 500),
        pointsPrice: Math.floor(Math.random() * 1000 + 500),
        count: Math.floor(Math.random() * 10 + 1),
    });
}

export async function seedPrizes() {
    for (const { title, lotteryId, moneyPrice, pointsPrice, count } of PRIZES) {
        if (title && !(await getPrizeByTitle(title))) {
            await createPrize(title, lotteryId, moneyPrice, pointsPrice, count);
        }
    }
}