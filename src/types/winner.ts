export interface WinnerTicketUser {
    number: string; // ticket.id
    place: number | null;
    user: {
        name: string;
        email: string;
    };
}

export interface PrizeWinner {
    id: string;
    title: string | null;
    moneyPrice: number;
    pointsPrice: number;
    count: number;
}
