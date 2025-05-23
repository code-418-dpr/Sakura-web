import { Prize } from "@/types/prize";

export interface LotteryRequestData {
    title: string;
    description: string;
    isReal: boolean;
    start: Date;
    end: Date;
    participantsCount: number;
    vipParticipantsCount: number;
    winnersCount: number;
    primeWinnersCount: number;
    ticketPrice: number;
    vipDiscount: number;
    rules: string;
    prizes: Prize[];
}
