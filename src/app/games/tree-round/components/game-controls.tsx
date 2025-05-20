import { motion } from "framer-motion";

import React from "react";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface GameControlsProps {
    currentReward: number;
    onCashOut: () => void;
    onReset: () => void;
    gameActive: boolean;
    gameWon: boolean;
    gameLost: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
    currentReward,
    onCashOut,
    onReset,
    gameActive,
    gameWon,
    gameLost,
}) => {
    return (
        <motion.div
            className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
        >
            {gameActive && currentReward > 0 && (
                <Button
                    color="success"
                    size="lg"
                    onPress={onCashOut}
                    className="px-8 font-bold shadow-lg"
                    startContent={<Icon icon="lucide:dollar-sign" width={20} />}
                >
                    Cash Out ${currentReward.toLocaleString()}
                </Button>
            )}

            {(gameWon || gameLost) && (
                <Button
                    color="primary"
                    size="lg"
                    onPress={onReset}
                    className="px-8 font-bold shadow-lg"
                    startContent={<Icon icon="lucide:refresh-cw" width={20} />}
                >
                    Play Again
                </Button>
            )}
        </motion.div>
    );
};
