import React, { useState } from "react";

import { updateUser } from "@/data/user";
import { useAuth } from "@/hooks/use-auth";
import { Button, Card, CardBody, Input } from "@heroui/react";

import { allShipsPlaced, useGame } from "../context/game-context";
import type { GameAction, GameState, Ship } from "../types/game";

interface SafePlacement {
    enabled: boolean;
    placedShips: Ship[];
}

export const GameHeader: React.FC = () => {
    const { user, update } = useAuth();
    // Приводим контекст к известным типам, включая placement
    const { state, dispatch } = useGame() as {
        state: GameState & { placement: SafePlacement };
        dispatch: React.Dispatch<GameAction>;
        ROW_LABELS: string[];
    };
    const [betAmount, setBetAmount] = useState<string>("100");

    const placementEnabled = state.placement.enabled;
    const placedShips: Ship[] = state.placement.placedShips;

    const handleStartGame = async () => {
        const bet = parseInt(betAmount, 10);
        if (!user) return null;
        if (Number(user.realBalance) < bet) {
            alert("You don't have enough balance to place this bet");
            return;
        }
        if (isNaN(bet) || bet <= 0) {
            alert("Please enter a valid bet amount");
            return;
        }

        if (placementEnabled && !allShipsPlaced(placedShips)) {
            alert("Please place all your ships before starting the game");
            return;
        }
        await updateUser(user.id, Number(user.realBalance) - bet, Number(user.virtualBalance));
        await update();
        dispatch({ type: "START_GAME", bet });
    };

    const handleResetGame = () => {
        dispatch({ type: "RESET_GAME" });
    };

    const handleTogglePlacement = () => {
        dispatch({ type: "MANUAL_SHIP_PLACEMENT", enabled: !placementEnabled });
    };

    const handleClearShips = () => {
        dispatch({ type: "CLEAR_PLAYER_SHIPS" });
    };

    return (
        <Card className="bg-content1 mb-6">
            <CardBody>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div>
                        <h1 className="text-primary mb-2 text-2xl font-bold md:text-3xl">Naval Battle Lottery</h1>
                        <p className="text-foreground-600">{state.message}</p>
                    </div>

                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <p className="text-foreground-500 text-sm">Player Score</p>
                                <p className="text-primary text-xl font-bold">{state.player.score}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-foreground-500 text-sm">Bot Score</p>
                                <p className="text-danger text-xl font-bold">{state.bot.score}</p>
                            </div>
                            {state.gameStarted && (
                                <div className="text-center">
                                    <p className="text-foreground-500 text-sm">Pot</p>
                                    <p className="text-success text-xl font-bold">{state.pot}</p>
                                </div>
                            )}
                        </div>

                        {!state.gameStarted ? (
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <div className="flex gap-2">
                                    <Button
                                        color={placementEnabled ? "success" : "default"}
                                        variant="flat"
                                        onPress={handleTogglePlacement}
                                        className="min-w-[140px]"
                                    >
                                        {placementEnabled ? "Manual Placement" : "Random Placement"}
                                    </Button>

                                    {placementEnabled && placedShips.length > 0 && (
                                        <Button color="danger" variant="flat" onPress={handleClearShips}>
                                            Clear Ships
                                        </Button>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        label="Your Bet"
                                        value={betAmount}
                                        onValueChange={setBetAmount}
                                        min="1"
                                        className="w-32"
                                    />
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            void handleStartGame();
                                        }}
                                    >
                                        Start Game
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Button color="danger" variant="flat" onPress={handleResetGame}>
                                New Game
                            </Button>
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
