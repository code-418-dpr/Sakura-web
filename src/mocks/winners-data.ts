// Mock data for winners
export interface Winner {
    id: number;
    name: string;
    prize: string;
    ticket: string;
    date: string;
    avatar: string;
}

export const winners: Winner[] = [
    // Сгенерировано примеры участников с уникальными id и аватарами
    { id: 1,  name: "Emma Johnson",       prize: "$10,000", ticket: "#A12345", date: "2 дня назад",    avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=1" },
    { id: 2,  name: "Michael Chen",       prize: "$5,000",  ticket: "#B67890", date: "3 дня назад",    avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=2" },
    { id: 3,  name: "Sophia Rodriguez",   prize: "$25,000", ticket: "#C24680", date: "5 дней назад",  avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=3" },
    { id: 4,  name: "James Wilson",       prize: "$7,500",  ticket: "#D13579", date: "1 неделю назад", avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=4" },
    { id: 5,  name: "Olivia Martinez",    prize: "$15,000", ticket: "#E11223", date: "1 неделю назад", avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=5" },
    { id: 6,  name: "William Taylor",     prize: "$50,000", ticket: "#F45678", date: "2 недели назад", avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=6" },
    { id: 7,  name: "Ava Thompson",       prize: "$3,000",  ticket: "#G98765", date: "2 недели назад", avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=7" },
    { id: 8,  name: "Noah Garcia",        prize: "$12,000", ticket: "#H12345", date: "3 недели назад", avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=8" },
    { id: 9,  name: "Isabella Lee",       prize: "$20,000", ticket: "#I54321", date: "3 недели назад", avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=9" },
    { id: 10, name: "Liam Brown",         prize: "$8,500",  ticket: "#J67890", date: "1 месяц назад",   avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=10" },
    { id: 11, name: "Mia Davis",          prize: "$6,000",  ticket: "#K12345", date: "1 месяц назад",   avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=11" },
    { id: 12, name: "Noah Wilson",        prize: "$14,000", ticket: "#L24680", date: "1 месяц назад",   avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=12" },
    { id: 13, name: "Charlotte Moore",    prize: "$9,000",  ticket: "#M13579", date: "5 дней назад",  avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=13" },
    { id: 14, name: "Elijah Taylor",       prize: "$11,500", ticket: "#N11223", date: "2 дня назад",    avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=14" },
    { id: 15, name: "Amelia Anderson",    prize: "$4,200",  ticket: "#O45678", date: "4 дня назад",    avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=15" },
    { id: 16, name: "Lucas Thomas",       prize: "$22,000", ticket: "#P98765", date: "2 недели назад", avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=16" },
    { id: 17, name: "Harper Jackson",     prize: "$18,000", ticket: "#Q12345", date: "3 недели назад", avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=17" },
    { id: 18, name: "Evelyn White",       prize: "$7,800",  ticket: "#R54321", date: "1 неделю назад", avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=18" },
    { id: 19, name: "Mason Harris",       prize: "$13,000", ticket: "#S67890", date: "2 недели назад", avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=19" },
    { id: 20, name: "Ella Martin",        prize: "$5,500",  ticket: "#T12345", date: "5 дней назад",  avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=20" },
    { id: 21, name: "Logan Thompson",     prize: "$16,000", ticket: "#U24680", date: "1 месяц назад",   avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=21" },
    { id: 22, name: "Grace Jackson",      prize: "$2,500",  ticket: "#V13579", date: "3 дня назад",    avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=22" },
    { id: 23, name: "Oliver Brown",       prize: "$30,000", ticket: "#W11223", date: "2 месяца назад", avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=23" },
    { id: 24, name: "Chloe Lee",          prize: "$3,700",  ticket: "#X45678", date: "4 дня назад",    avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=24" },
    { id: 25, name: "Henry Wilson",       prize: "$28.000", ticket: "#Y98765", date: "2 месяца назад", avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=25" },
    { id: 26, name: "Avery Davis",        prize: "$9,200",  ticket: "#Z12345", date: "1 месяц назад",   avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=26" },
    { id: 27, name: "Carter Smith",       prize: "$17,500", ticket: "#A13579", date: "5 дней назад",  avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=27" },
    { id: 28, name: "Zoey Martinez",      prize: "$19,000", ticket: "#B24680", date: "3 недели назад", avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=28" },
    { id: 29, name: "Wyatt Hernandez",    prize: "$6,300",  ticket: "#C11223", date: "2 недели назад", avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=29" },
    { id: 30, name: "Luna Clark",         prize: "$14,700", ticket: "#D45678", date: "1 месяц назад",   avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=30" },
];

// Разбиение на группы по 4 человека для анимации
export const winnerGroups: Winner[][] = Array.from(
    { length: Math.ceil(winners.length / 4) },
    (_, i) => winners.slice(i * 4, i * 4 + 4)
);
