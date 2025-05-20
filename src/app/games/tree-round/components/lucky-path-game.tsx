import React from "react";

import { addToast } from "@heroui/react";

import { gameConfig, generateWinningPath, getRewardForLevel } from "../data/game-data";
import { GameControls } from "./game-controls";
import { GameModal } from "./game-modal";
import { GameStatus } from "./game-status";
import { GameTree } from "./game-tree";

interface ModalConfig {
    title: string;
    message: string;
    type: "win" | "lose" | "cashout" | "instructions";
    reward?: number;
}

export const LuckyPathGame: React.FC = () => {
    const [currentLevel, setCurrentLevel] = React.useState(1);
    const [playerPath, setPlayerPath] = React.useState<number[]>([]);
    const [winningPath, setWinningPath] = React.useState<number[]>([]);
    const [currentReward, setCurrentReward] = React.useState(0);
    const [potentialReward, setPotentialReward] = React.useState(getRewardForLevel(1));
    const [gameActive, setGameActive] = React.useState(true);
    const [gameWon, setGameWon] = React.useState(false);
    const [gameLost, setGameLost] = React.useState(false);

    // Modal state
    const [showModal, setShowModal] = React.useState(true);
    const [modalConfig, setModalConfig] = React.useState<ModalConfig>({
        title: "Lucky Path Game",
        message:
            "Choose the correct path at each level to win the prize. You can cash out at any time, but one wrong choice and you lose everything!",
        type: "instructions",
    });

    // Initialize or reset the game
    const initGame = () => {
        setCurrentLevel(1);
        setPlayerPath([]);
        setWinningPath(generateWinningPath(gameConfig.maxLevels, gameConfig.pathOptions));
        setCurrentReward(0);
        setPotentialReward(getRewardForLevel(1));
        setGameActive(true);
        setGameWon(false);
        setGameLost(false);
    };

    // Initialize the game on first render
    React.useEffect(() => {
        initGame();
    }, []);

    // Path selection handler
    const handleSelectPath = (pathIndex: number) => {
        if (!gameActive) return;

        const isCorrectPath = winningPath[currentLevel - 1] === pathIndex;
        const newPlayerPath = [...playerPath, pathIndex];
        setPlayerPath(newPlayerPath);

        if (isCorrectPath) {
            // Correct path chosen
            const newReward = getRewardForLevel(currentLevel);
            setCurrentReward(newReward);

            // Check if player has reached the final level
            if (currentLevel === gameConfig.maxLevels) {
                // Game won!
                setGameActive(false);
                setGameWon(true);
                setShowModal(true);
                setModalConfig({
                    title: "Congratulations!",
                    message: "You found the winning path and won the maximum prize!",
                    type: "win",
                    reward: newReward,
                });
                addToast({
                    title: "You won!",
                    description: `You've won $${newReward.toLocaleString()}!`,
                    color: "success",
                });
            } else {
                // Move to next level
                setCurrentLevel(currentLevel + 1);
                setPotentialReward(getRewardForLevel(currentLevel + 1));
                addToast({
                    title: "Correct path!",
                    description: `You've earned $${newReward.toLocaleString()}`,
                    color: "success",
                });
            }
        } else {
            // Wrong path chosen - game over
            setGameActive(false);
            setGameLost(true);
            setShowModal(true);
            setModalConfig({
                title: "Game Over",
                message: "You chose the wrong path and lost everything!",
                type: "lose",
            });
            addToast({
                title: "Wrong path!",
                description: "You lost everything!",
                color: "danger",
            });
        }
    };

    // Cash out handler
    const handleCashOut = () => {
        setGameActive(false);
        setShowModal(true);
        setModalConfig({
            title: "Cash Out Successful",
            message: "You decided to play it safe and cash out your winnings!",
            type: "cashout",
            reward: currentReward,
        });
        addToast({
            title: "Cash Out",
            description: `You cashed out with $${currentReward.toLocaleString()}`,
            color: "primary",
        });
    };

    // Reset game handler
    const handleReset = () => {
        initGame();
    };

    return (
        <div className="mx-auto max-w-4xl">
            {/* Game Status */}
            <GameStatus
                currentLevel={currentLevel}
                maxLevels={gameConfig.maxLevels}
                currentReward={currentReward}
                potentialReward={potentialReward}
            />

            {/* Game Tree */}
            <GameTree
                config={gameConfig}
                currentLevel={currentLevel}
                winningPath={winningPath}
                playerPath={playerPath}
                onSelectPath={handleSelectPath}
                gameEnded={!gameActive}
            />

            {/* Game Controls */}
            <GameControls
                currentReward={currentReward}
                onCashOut={handleCashOut}
                onReset={handleReset}
                gameActive={gameActive}
                gameWon={gameWon}
                gameLost={gameLost}
            />

            {/* Game Modal */}
            <GameModal
                isOpen={showModal}
                onOpenChange={setShowModal}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                reward={modalConfig.reward}
            />
        </div>
    );
};
