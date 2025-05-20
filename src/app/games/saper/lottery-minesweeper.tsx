"use client";

import { AnimatePresence, motion } from "framer-motion";

import React from "react";

import { Button, Progress, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

// bring in our config and mock-board helper
import { GAME_CONFIG, getRandomMockBoard } from "./data/game-mocks";

// Types
interface Tile {
    id: number;
    revealed: boolean;
    hasBomb: boolean;
    prize: number;
}

interface GameState {
    tiles: Tile[];
    score: number;
    bombsCount: number;
    gameOver: boolean;
    gameWon: boolean;
    revealedCount: number;
    maxReveals: number;
    collectedWinnings: number;
    currentRoundScore: number;
}

export const LotteryMinesweeper: React.FC = () => {
    // Constants
    const GRID_SIZE = GAME_CONFIG.GRID_SIZE;
    const TOTAL_TILES = GRID_SIZE * GRID_SIZE;
    const DEFAULT_BOMBS = GAME_CONFIG.DEFAULT_BOMBS;
    const MAX_REVEALS = TOTAL_TILES - DEFAULT_BOMBS;

    // Game state
    const [gameState, setGameState] = React.useState<GameState>(() => initializeGame());
    // ← теперь явно boolean, а не literal false
    const [isRestarting, setIsRestarting] = React.useState<boolean>(false);
    const [isCollecting, setIsCollecting] = React.useState<boolean>(false);

    // Initialize game
    function initializeGame(): GameState {
        const mockBoard = getRandomMockBoard();

        const tiles: Tile[] = Array(TOTAL_TILES)
            .fill(null)
            .map((_, id) => {
                const isBomb = mockBoard.bombs.includes(id);
                return {
                    id,
                    revealed: false,
                    hasBomb: isBomb,
                    prize: isBomb ? 0 : mockBoard.prizes[id],
                };
            });

        return {
            tiles,
            score: 0,
            bombsCount: DEFAULT_BOMBS,
            gameOver: false,
            gameWon: false,
            revealedCount: 0,
            maxReveals: MAX_REVEALS,
            collectedWinnings: 0,
            currentRoundScore: 0,
        };
    }

    // Handle tile click
    const handleTileClick = (tile: Tile) => {
        if (gameState.gameOver || gameState.gameWon || tile.revealed) return;

        const updatedTiles = [...gameState.tiles];
        const clickedTile = updatedTiles[tile.id];
        clickedTile.revealed = true;

        let updatedScore = gameState.currentRoundScore;
        let gameOver: boolean = gameState.gameOver;
        let gameWon: boolean = gameState.gameWon;
        const revealedCount = gameState.revealedCount + 1;

        if (clickedTile.hasBomb) {
            gameOver = true;
            updatedScore = 0;
        } else {
            updatedScore += clickedTile.prize;
            if (revealedCount >= MAX_REVEALS) {
                gameWon = true;
            }
        }

        setGameState({
            ...gameState,
            tiles: updatedTiles,
            currentRoundScore: updatedScore,
            gameOver,
            gameWon,
            revealedCount,
        });
    };

    // Collect winnings
    const collectWinnings = () => {
        setIsCollecting(true);

        setTimeout(() => {
            setGameState({
                ...gameState,
                collectedWinnings: gameState.collectedWinnings + gameState.currentRoundScore,
                currentRoundScore: 0,
            });
            setIsCollecting(false);
        }, 500);
    };

    // Restart game with animation
    const restartGame = () => {
        setIsRestarting(true);
        setTimeout(() => {
            setGameState(initializeGame());
            setIsRestarting(false);
        }, 500);
    };

    // Calculate progress percentage
    const progressPercentage = (gameState.revealedCount / MAX_REVEALS) * 100;

    return (
        <div className="flex flex-col gap-4">
            {/* Game stats */}
            <div className="mb-2 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-default-500 text-xs">Current Round</span>
                    <motion.span
                        key={gameState.currentRoundScore}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.3 }}
                        className="text-xl font-bold"
                    >
                        ${gameState.currentRoundScore}
                    </motion.span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-default-500 text-xs">Total Collected</span>
                    <motion.span
                        key={gameState.collectedWinnings}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.3 }}
                        className="text-success-600 text-xl font-bold"
                    >
                        ${gameState.collectedWinnings}
                    </motion.span>
                </div>
            </div>

            {/* Bombs indicator */}
            <div className="mb-2 flex items-center gap-2">
                <Icon icon="lucide:bomb" className="text-danger" />
                <span className="text-sm font-medium">{gameState.bombsCount} bombs hidden</span>
            </div>

            {/* Progress bar */}
            <div className="mb-2">
                <div className="text-default-500 mb-1 flex justify-between text-xs">
                    <span>Progress</span>
                    <span>
                        {gameState.revealedCount}/{MAX_REVEALS}
                    </span>
                </div>
                <Progress color="primary" value={progressPercentage} className="h-2" aria-label="Game progress" />
            </div>

            {/* Game grid */}
            <div
                className="mb-4 grid grid-cols-5 gap-2"
                style={{
                    opacity: isRestarting ? 0.5 : 1,
                    transition: "opacity 0.3s ease",
                }}
            >
                {gameState.tiles.map((tile) => (
                    <Tile
                        key={tile.id}
                        tile={tile}
                        onClick={() => {
                            handleTileClick(tile);
                        }}
                        gameOver={gameState.gameOver}
                    />
                ))}
            </div>

            {/* Game over or win message */}
            <AnimatePresence>
                {(gameState.gameOver || gameState.gameWon) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`mb-4 rounded-lg p-4 text-center ${
                            gameState.gameWon ? "bg-success-100 text-success-700" : "bg-danger-100 text-danger-700"
                        }`}
                    >
                        <h3 className="mb-1 text-lg font-bold">{gameState.gameWon ? "You Won!" : "Game Over!"}</h3>
                        <p>
                            {gameState.gameWon
                                ? `Congratulations! You won $${gameState.currentRoundScore}!`
                                : `You hit a bomb! Your winnings for this round are lost.`}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex gap-2">
                <Button
                    color="success"
                    onPress={collectWinnings}
                    isDisabled={isCollecting || gameState.currentRoundScore === 0 || isRestarting}
                    className="flex-1"
                >
                    {isCollecting ? (
                        <div className="flex items-center gap-2">
                            <Icon icon="lucide:loader" className="animate-spin" />
                            <span>Collecting...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Icon icon="lucide:piggy-bank" />
                            <span>Collect ${gameState.currentRoundScore}</span>
                        </div>
                    )}
                </Button>

                <Button
                    color={gameState.gameOver ? "danger" : gameState.gameWon ? "success" : "primary"}
                    onPress={restartGame}
                    isDisabled={isRestarting}
                    className="flex-1"
                >
                    {isRestarting ? (
                        <div className="flex items-center gap-2">
                            <Icon icon="lucide:loader" className="animate-spin" />
                            <span>Restarting...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Icon icon="lucide:refresh-cw" />
                            <span>{gameState.gameOver || gameState.gameWon ? "New Game" : "Restart"}</span>
                        </div>
                    )}
                </Button>
            </div>
        </div>
    );
};

// Tile component
interface TileProps {
    tile: Tile;
    onClick: () => void;
    gameOver: boolean;
}

const Tile: React.FC<TileProps> = ({ tile, onClick, gameOver }) => (
    <Tooltip content={tile.revealed || gameOver ? "" : "Click to reveal"} delay={500}>
        <motion.div
            whileHover={!tile.revealed && !gameOver ? { scale: 1.05 } : {}}
            whileTap={!tile.revealed && !gameOver ? { scale: 0.95 } : {}}
            onClick={onClick}
            className={`flex aspect-square cursor-pointer items-center justify-center rounded-md ${
                tile.revealed
                    ? tile.hasBomb
                        ? "bg-danger-100 border-danger"
                        : "bg-primary-50 border-primary-200"
                    : "bg-default-100 hover:bg-default-200 border-default-200"
            } border-2 shadow-sm transition-colors ${!tile.revealed && !gameOver ? "hover:shadow-md" : ""} `}
        >
            <AnimatePresence>
                {tile.revealed ? (
                    <motion.div
                        initial={{ opacity: 0, rotate: -10, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        className="flex items-center justify-center"
                    >
                        {tile.hasBomb ? (
                            <Icon icon="lucide:bomb" className="text-danger text-2xl" />
                        ) : (
                            <span className="text-primary-700 font-bold">${tile.prize}</span>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="from-default-200 to-default-100 h-full w-full rounded-md bg-gradient-to-br"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    </Tooltip>
);
