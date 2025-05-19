import { Prize } from "@/app/generated/prisma";

export interface Lottery {
    id: string;
    title: string;
    description: string;
    type: string;
    image: string | null;
    participantsCount: number;
    vipParticipantsCount: number;
    winnersCount: number;
    primeWinnersCount: number;
    ticketPrice: number;
    vipDiscount: number;
    start: Date;
    end: Date;
    rules: string;
    isReal?: boolean;
}

export interface LotteryPrizes {
    id: string;
    title: string;
    description: string;
    type: string;
    image: string | null;
    participantsCount: number;
    vipParticipantsCount: number;
    winnersCount: number;
    primeWinnersCount: number;
    ticketPrice: number;
    vipDiscount: number;
    start: Date;
    end: Date;
    rules: string;
    isReal?: boolean;
    prizes: Prize[];
}
