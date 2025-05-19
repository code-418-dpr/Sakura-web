export interface LotteryItem {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    isVirtual: boolean;
    prize: number;
}

export interface SearchLotteriesParams {
    query?: string;
    start?: Date;
    end?: Date;
    isVip?: boolean;
    prizeType?: "MONEY" | "POINTS" | "PRODUCTS";
    isReal?: boolean;
    ticketPrice?: number;
    minTicketPrice?: number;
    maxTicketPrice?: number;
    page?: number;
    pageSize?: number;
}
