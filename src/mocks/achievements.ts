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
        title: "Эксперт проектов",
        description: "Успешно завершите 5 проектов с отличной оценкой.",
        progress: 40,
        medalType: "gold",
        completed: false,
    },
    {
        id: 4,
        title: "Командный игрок",
        description: "Примите участие в 3 групповых проектах и внесите значительный вклад.",
        progress: 33,
        medalType: "bronze",
        completed: false,
    },
    {
        id: 5,
        title: "Инноватор",
        description: "Предложите 5 новых идей, которые будут реализованы в проекте.",
        progress: 60,
        medalType: "gold",
        completed: false,
    },
    {
        id: 6,
        title: "Постоянство",
        description: "Выполняйте задания каждый день в течение 30 дней подряд.",
        progress: 83,
        medalType: "silver",
        completed: false,
    },
];
