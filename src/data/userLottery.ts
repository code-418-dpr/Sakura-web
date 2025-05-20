export interface UserLotteryData {
    start: string | number | Date;
    userId: string;
    lotteries: UserLottery[];
}

export interface UserLottery {
    id: string;
    title: string;
    description: string;
    type: "REAL" | "VIRTUAL";
    image: string | null;
    start: Date;
    end: Date;
    ticketPrice: number;
    participantsCount: string;
    winnersCount: string;
    userTicket: UserTicket;
    vipDiscount: number;
    vipParticipantsCount: string;
    rules: string;
    prizes: Prize[];
}
export interface UsersLotteryTicket {
    id: string;
    title: string;
    description: string;
    type: "REAL" | "VIRTUAL";
    image: string | null;
    start: Date;
    end: Date;
    ticketPrice: number;
    participantsCount: string;
    winnersCount: string;
    userTickets: UserTicket[];
    vipDiscount: number;
    vipParticipantsCount: string;
    rules: string;
    prizes: Prize[];
}
interface UserTicket {
    number: number;
    price: number;
    place: number | null;
}

interface Prize {
    id: string;
    title: string | null;
    moneyPrice: number;
    pointsPrice: number;
    count: number;
}
