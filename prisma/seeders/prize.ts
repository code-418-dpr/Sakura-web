import { Prisma } from "@/app/generated/prisma";
import { getLotteryAll } from "@/data/lottery";
import { createPrize, getPrizeByLotteryIdAndMoneyPrize } from "@/data/prize";

const PRIZES: Prisma.PrizeUncheckedCreateInput[] = [];

const lotteries = await getLotteryAll();
for (const lottery of lotteries) {
    const count = lottery.winnersCount + lottery.primeWinnersCount;
    for (let i = 0; i < count; i++) {
        const moneyPrice = Math.floor(Math.random() * 1000 + 500);
        const pointsPrice = Math.floor(Math.random() * 1000 + 500);
        PRIZES.push({
            title: 
                i % 3 === 0
                ? lottery.isReal ? `${moneyPrice} рублей` : `${pointsPrice} липестков`
                : i % 3 === 1
                ? `Смартфон Apple iPhone 13`
                : `Квартира в центре Москвы`,
            lotteryId: lottery.id,
            moneyPrice: moneyPrice,
            pointsPrice: pointsPrice,
            count: Math.floor(Math.random() * 10 + 1),
        });
    }
}

export async function seedPrizes() {
    for (const { title, lotteryId, moneyPrice, pointsPrice, count } of PRIZES) {
        if (title && !(await getPrizeByLotteryIdAndMoneyPrize(lotteryId, moneyPrice))) {
            await createPrize(title, lotteryId, moneyPrice, pointsPrice, count);
        }
    }
}
