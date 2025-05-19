export interface Lottery {
    id: string;
    title: string;
    description: string;
    type: "REAL" | "VIRTUAL";
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
}
