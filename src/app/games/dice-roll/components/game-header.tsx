import React from "react";

import { Icon } from "@iconify/react";

import { useGame } from "./game-context";

export const GameHeader: React.FC = () => {
    const { state } = useGame();

    return (
        <div className="flex w-full flex-col">
            <div className="flex items-center justify-between">
                <h1 className="flex items-center gap-2 text-2xl font-bold">
                    <Icon icon="lucide:dices" className="text-primary" width={28} height={28} />
                    Cube Battle
                </h1>
                <div className="bg-primary-100 dark:bg-primary-900 flex items-center gap-2 rounded-lg px-4 py-2">
                    <Icon icon="lucide:coins" className="text-primary" />
                    <span className="font-bold">{state.balance} coins</span>
                </div>
            </div>
            <p className="text-default-500 mt-1">Place your bets, roll the dice, and test your luck!</p>
        </div>
    );
};
