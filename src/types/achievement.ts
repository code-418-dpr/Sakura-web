export interface Achievement {
    id: number;
    title: string;
    description: string;
    progress: number;
    medalType: "bronze" | "silver" | "gold";
    completed: boolean;
}
