export interface UserLotteryData {
    start: string | number | Date;
    userId: string;
    lotteries: UserLottery[];
}

interface UserLottery {
    id: string;
    title: string;
    description: string;
    type: "REAL" | "VIRTUAL";
    image: string | null;
    start: Date;
    end: Date;
    userTicket: UserTicket;
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
