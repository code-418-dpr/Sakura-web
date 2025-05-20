import React from "react";

import { Card, CardBody, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";

import { GameRound, useGame } from "./game-context";

export const GameHistory: React.FC = () => {
    const { state } = useGame();

    const formatTimestamp = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(date);
    };

    const getModeDisplay = (round: GameRound) => {
        if (round.mode === "HighLow") {
            return `High & Low (${round.goal})`;
        } else if (round.mode === "Exact") {
            return `Precisely (${round.goal})`;
        } else if (round.mode === "Par") {
            return `Par-Impar (${round.goal === 2 ? "Even" : "Odd"})`;
        }
        return round.mode;
    };

    return (
        <Card>
            <CardBody>
                <h2 className="mb-4 text-xl font-bold">Game History</h2>
                {state.history.length === 0 ? (
                    <div className="text-default-500 py-8 text-center">
                        No games played yet. Start playing to see your history!
                    </div>
                ) : (
                    <Table removeWrapper aria-label="Game history table">
                        <TableHeader>
                            <TableColumn>TIME</TableColumn>
                            <TableColumn>MODE</TableColumn>
                            <TableColumn>BET</TableColumn>
                            <TableColumn>ROLL</TableColumn>
                            <TableColumn>RESULT</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {state.history.map((round) => (
                                <TableRow key={round.id}>
                                    <TableCell>{formatTimestamp(round.timestamp)}</TableCell>
                                    <TableCell>{getModeDisplay(round)}</TableCell>
                                    <TableCell>{round.bet} coins</TableCell>
                                    <TableCell>
                                        {round.dice1 !== undefined && round.dice2 !== undefined ? (
                                            <span>
                                                {round.dice1} + {round.dice2} = {round.dice1 + round.dice2}
                                            </span>
                                        ) : (
                                            "N/A"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {round.result === "win" ? (
                                            <Chip color="success" variant="flat">
                                                +{round.winAmount} coins
                                            </Chip>
                                        ) : (
                                            <Chip color="danger" variant="flat">
                                                -{round.bet} coins
                                            </Chip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardBody>
        </Card>
    );
};
