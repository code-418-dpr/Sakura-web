import { motion } from "framer-motion";

import React from "react";

import { Card, CardBody, Progress } from "@heroui/react";

interface GameStatusProps {
    currentLevel: number;
    maxLevels: number;
    currentReward: number;
    potentialReward: number;
}

export const GameStatus: React.FC<GameStatusProps> = ({ currentLevel, maxLevels, currentReward, potentialReward }) => {
    const progressValue = ((currentLevel - 1) / maxLevels) * 100;

    return (
        <Card className="bg-game-card text-game-foreground mb-8 shadow-xl">
            <CardBody>
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-slate-300">Progress:</span>
                    <span className="font-medium">
                        {currentLevel - 1} / {maxLevels}
                    </span>
                </div>

                <Progress aria-label="Game progress" value={progressValue} color="primary" className="mb-4" />

                <div className="flex justify-between">
                    <div>
                        <span className="block text-slate-300">Current:</span>
                        <motion.span
                            className="text-xl font-bold text-green-400"
                            key={currentReward}
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.3 }}
                        >
                            ${currentReward.toLocaleString()}
                        </motion.span>
                    </div>
                    <div>
                        <span className="block text-slate-300">Next Prize:</span>
                        <motion.span
                            className="text-xl font-bold text-yellow-400"
                            key={potentialReward}
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.3 }}
                        >
                            ${potentialReward.toLocaleString()}
                        </motion.span>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
