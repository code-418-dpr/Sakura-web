import React from "react";

import { Card, CardBody } from "@heroui/react";

import { useGame } from "../context/game-context";
import { BotBoard } from "./bot-board";
import { PlayerBoard } from "./player-board";

export const GameBoard: React.FC = () => {
    const { state } = useGame();

    return (
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="bg-content1">
                <CardBody>
                    <h2 className="mb-4 text-xl font-semibold">Your Fleet</h2>
                    <div className="flex justify-center">
                        <PlayerBoard />
                    </div>
                    <div className="text-foreground-500 mt-4 text-center text-sm">
                        {state.gameStarted ? (
                            <p>
                                Ships Remaining: {state.player.ships.filter((ship) => ship.hits < ship.size).length}/10
                            </p>
                        ) : (
                            <p>Place your bet to start the game</p>
                        )}
                    </div>
                </CardBody>
            </Card>

            <Card className="bg-content1">
                <CardBody>
                    <h2 className="mb-4 text-xl font-semibold">Enemy Waters</h2>
                    <div className="flex justify-center">
                        <BotBoard />
                    </div>
                    <div className="text-foreground-500 mt-4 text-center text-sm">
                        {state.gameStarted ? (
                            <p>
                                Enemy Ships Remaining: {state.bot.ships.filter((ship) => ship.hits < ship.size).length}
                                /10
                            </p>
                        ) : (
                            <p>Place your bet to start the game</p>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};
