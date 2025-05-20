import React from "react";

import { Icon } from "@iconify/react";

import { useGame } from "../context/game-context";

export const BotBoard: React.FC = () => {
    const { state, dispatch, ROW_LABELS } = useGame();
    const { shotsBoard } = state.player;
    const { gameStarted, isPlayerTurn, gameOver } = state;

    const handleCellClick = (row: number, col: number) => {
        if (gameStarted && isPlayerTurn && !gameOver) {
            dispatch({ type: "PLAYER_SHOT", coordinate: { row, col } });
        }
    };

    return (
        <div className="relative">
            {/* Column headers (1-10) */}
            <div className="mb-1 flex">
                <div className="h-8 w-8"></div>
                {Array(10)
                    .fill(null)
                    .map((_, index) => (
                        <div key={index} className="flex h-8 w-8 items-center justify-center text-sm font-medium">
                            {index + 1}
                        </div>
                    ))}
            </div>

            {/* Game board */}
            {shotsBoard.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                    {/* Row headers (A-K) */}
                    <div className="flex h-8 w-8 items-center justify-center text-sm font-medium">
                        {ROW_LABELS[rowIndex]}
                    </div>

                    {/* Cells */}
                    {row.map((cell, colIndex) => (
                        <div
                            key={colIndex}
                            className={`border-default-200 flex h-8 w-8 items-center justify-center border ${cell === "empty" && gameStarted && isPlayerTurn && !gameOver ? "hover:bg-default-100 cursor-pointer" : ""} ${cell === "hit" ? "bg-danger-100" : ""} ${cell === "miss" ? "bg-default-100" : ""} ${cell === "sunk" ? "bg-danger-200" : ""} `}
                            onClick={() => {
                                handleCellClick(rowIndex, colIndex);
                            }}
                        >
                            {cell === "hit" && <Icon icon="lucide:x" className="text-danger-500" />}
                            {cell === "miss" && <div className="bg-default-400 h-2 w-2 rounded-full"></div>}
                            {cell === "sunk" && <Icon icon="lucide:anchor" className="text-danger-600" />}
                        </div>
                    ))}
                </div>
            ))}

            {/* Overlay when it's not player's turn */}
            {gameStarted && !isPlayerTurn && !gameOver && (
                <div className="bg-background/30 absolute inset-0 flex items-center justify-center">
                    <div className="bg-content2 rounded-md p-3 shadow-md">
                        <p className="text-sm font-medium">Bot is thinking...</p>
                    </div>
                </div>
            )}

            {/* Overlay when game is not started */}
            {!gameStarted && (
                <div className="bg-background/30 absolute inset-0 flex items-center justify-center">
                    <div className="bg-content2 rounded-md p-3 shadow-md">
                        <p className="text-sm font-medium">Place your bet to start</p>
                    </div>
                </div>
            )}

            {/* Overlay when game is over */}
            {gameOver && (
                <div className="bg-background/30 absolute inset-0 flex items-center justify-center">
                    <div className="bg-content2 rounded-md p-3 shadow-md">
                        <p className="text-sm font-medium">{state.winner === "player" ? "You won!" : "Bot won!"}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
