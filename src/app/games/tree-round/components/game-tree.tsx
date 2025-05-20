import { motion } from "framer-motion";

import React from "react";

import { Icon } from "@iconify/react";

import { GameConfig } from "../data/game-data";

interface GameTreeProps {
    config: GameConfig;
    currentLevel: number;
    winningPath: number[];
    playerPath: number[];
    onSelectPath: (pathIndex: number) => void;
    gameEnded: boolean;
}

export const GameTree: React.FC<GameTreeProps> = ({
    config,
    currentLevel,
    winningPath,
    playerPath,
    onSelectPath,
    gameEnded,
}) => {
    // determine the Tailwind color for the connector line
    const getConnectorColor = (level: number, pathIdx: number, parentIdx: number | null) => {
        if (level === 1 || parentIdx === null) return "bg-gray-500";
        // winning branch after game end
        if (gameEnded && winningPath[level - 2] === parentIdx && winningPath[level - 1] === pathIdx) {
            return "bg-yellow-400";
        }
        // user's taken branch up to current level
        if (level <= currentLevel && playerPath[level - 2] === parentIdx && playerPath[level - 1] === pathIdx) {
            return "bg-green-400";
        }
        return "bg-gray-500";
    };

    // determine the Tailwind style for each node circle
    const getNodeStyle = (level: number, pathIdx: number) => {
        // current level -> purple glow
        if (level === currentLevel) {
            return "bg-purple-600 hover:bg-purple-700 cursor-pointer shadow-[0_0_8px_rgba(128,90,213,0.6)]";
        }
        // successfully passed levels -> green
        if (level < currentLevel && playerPath[level - 1] === pathIdx) {
            return "bg-green-500";
        }
        // winning branch after end -> yellow
        if (gameEnded && winningPath[level - 1] === pathIdx) {
            return "bg-yellow-500";
        }
        // lost branch (user chose but wasn't winning)
        if (
            gameEnded &&
            level < currentLevel &&
            playerPath[level - 1] === pathIdx &&
            winningPath[level - 1] !== pathIdx
        ) {
            return "bg-red-500";
        }
        // all others -> dark gray
        return "bg-gray-600";
    };

    // render the angled connector line from parent to this node
    const renderConnector = (level: number, pathIndex: number, parentPathIndex: number | null) => {
        if (level === 1 || parentPathIndex === null) return null;

        // choose angle -30°, 0°, +30°
        const angle = pathIndex === parentPathIndex ? 0 : pathIndex < parentPathIndex ? -30 : 30;

        // length of the line in px (adjust as needed)
        const length = 60;

        return (
            <div
                className="absolute top-0 left-1/2 w-[2px]"
                style={{
                    height: `${length}px`,
                    backgroundColor: getConnectorColor(level, pathIndex, parentPathIndex),
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: angle === 0 ? "center top" : angle < 0 ? "right top" : "left top",
                }}
            />
        );
    };

    return (
        <div className="relative mb-8 w-full py-8">
            <div className="flex flex-col items-center space-y-16">
                {Array.from({ length: config.maxLevels }).map((_, levelIndex) => {
                    const level = levelIndex + 1;
                    const parentIdx = level > 1 ? playerPath[level - 2] : null;

                    return (
                        <div key={level} className="w-full">
                            {/* Level label */}
                            <div className="mb-2 flex justify-center">
                                <span className="rounded-full bg-gray-800 px-3 py-1 text-sm font-medium text-white">
                                    Level {level}: $
                                    {config.rewards.find((r) => r.level === level)!.reward.toLocaleString()}
                                </span>
                            </div>

                            {/* Nodes */}
                            <div className="relative flex justify-center space-x-12">
                                {Array.from({ length: config.pathOptions }).map((_, pathIndex) => {
                                    const nodeStyle = getNodeStyle(level, pathIndex);
                                    const isSelectable = level === currentLevel && !gameEnded;

                                    // optional icon inside node (check, star, x)
                                    const iconName =
                                        level < currentLevel && playerPath[level - 1] === pathIndex
                                            ? "lucide:check"
                                            : gameEnded && winningPath[level - 1] === pathIndex
                                              ? "lucide:star"
                                              : gameEnded &&
                                                  level < currentLevel &&
                                                  playerPath[level - 1] === pathIndex &&
                                                  winningPath[level - 1] !== pathIndex
                                                ? "lucide:x"
                                                : "";

                                    return (
                                        <div key={pathIndex} className="relative">
                                            {/* Connector from parent */}
                                            {renderConnector(level, pathIndex, parentIdx)}

                                            {/* Node circle */}
                                            <motion.div
                                                className={`flex h-14 w-14 items-center justify-center rounded-full ${nodeStyle}`}
                                                whileHover={isSelectable ? { scale: 1.1 } : {}}
                                                onClick={() => {
                                                    if (isSelectable) onSelectPath(pathIndex);
                                                }}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: levelIndex * 0.1 }}
                                            >
                                                {iconName && <Icon icon={iconName} className="text-xl text-white" />}
                                            </motion.div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
