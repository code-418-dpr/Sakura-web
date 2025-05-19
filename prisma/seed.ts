import { seedLotteries } from "./seeders/lottery";
import { seedPrizes } from "./seeders/prize";
import { seedUsers } from "./seeders/user";

export async function main() {
    await seedUsers();
    await seedLotteries();
    await seedPrizes();
}

void main().catch((e: unknown) => {
    console.error("Ошибка сидирования", e);
    process.exit(1);
});
