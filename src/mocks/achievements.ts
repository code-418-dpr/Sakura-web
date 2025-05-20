import { Achievement } from "@/types/achievement";

export const achievements: Achievement[] = [
    {
        id: 1,
        title: "Первые шаги",
        description: "Завершите свое первое задание и начните свой путь к успеху.",
        progress: 100,
        medalType: "bronze",
        completed: true,
    },
    {
        id: 2,
        title: "Мастер задач",
        description: "Завершите 10 заданий и станьте мастером в выполнении задач.",
        progress: 70,
        medalType: "silver",
        completed: false,
    },
    {
        id: 3,
        title: "Новичок в этой сфере",
        description: "Сыграйте в 5 различных лотереях.",
        progress: 40,
        medalType: "bronze",
        completed: false,
    },
    {
        id: 4,
        title: "Тёртый калач",
        description: "Сыграйте в 10 различных лотереях.",
        progress: 10,
        medalType: "silver",
        completed: false,
    },
    {
        id: 5,
        title: "Green peace",
        description: "Не дайте своей сакуре увянуть в течении 20 дней",
        progress: 30,
        medalType: "gold",
        completed: false,
    },
    {
        id: 6,
        title: "Постоянство",
        description: "Выполняйте задания каждый день в течение 30 дней подряд.",
        progress: 83,
        medalType: "gold",
        completed: false,
    },
];
