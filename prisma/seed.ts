import { seedLotteries } from "./seeders/lottery";
import { seedUsers } from "./seeders/user";

export async function main() {
    await seedUsers();
    await seedLotteries();
}

void main().catch((e: unknown) => {
    console.error("Ошибка сидирования", e);
    process.exit(1);
});
