import { motion } from "framer-motion";

import React from "react";

import { useGame } from "./game-context";

export const DiceRoll: React.FC = () => {
    const { state } = useGame();
    const [diceValues, setDiceValues] = React.useState<[number, number]>([1, 1]);
    const [showAnimation, setShowAnimation] = React.useState(false);

    React.useEffect(() => {
        if (state.isRolling) {
            setShowAnimation(true);

            // Simulate dice rolling animation
            const interval = setInterval(() => {
                setDiceValues([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]);
            }, 100);

            return () => {
                clearInterval(interval);
            };
        } else if (state.history.length > 0) {
            const lastRoll = state.history[0];
            if (lastRoll.dice1 !== undefined && lastRoll.dice2 !== undefined) {
                setDiceValues([lastRoll.dice1, lastRoll.dice2]);
            }

            // Hide animation after roll is complete
            setTimeout(() => {
                setShowAnimation(false);
            }, 500);
        }
    }, [state.isRolling, state.history]);

    const renderDiceFace = (value: number) => {
        const dotPositions = {
            1: ["center"],
            2: ["top-left", "bottom-right"],
            3: ["top-left", "center", "bottom-right"],
            4: ["top-left", "top-right", "bottom-left", "bottom-right"],
            5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
            6: ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"],
        };

        const positions = dotPositions[value as keyof typeof dotPositions];

        const getDotClass = (position: string) => {
            switch (position) {
                case "top-left":
                    return "top-2 left-2";
                case "top-right":
                    return "top-2 right-2";
                case "middle-left":
                    return "top-1/2 left-2 -translate-y-1/2";
                case "middle-right":
                    return "top-1/2 right-2 -translate-y-1/2";
                case "center":
                    return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
                case "bottom-left":
                    return "bottom-2 left-2";
                case "bottom-right":
                    return "bottom-2 right-2";
                default:
                    return "";
            }
        };

        return (
            <div className="relative h-full w-full">
                {positions.map((position, index) => (
                    <div
                        key={index}
                        className={`bg-foreground absolute h-3 w-3 rounded-full ${getDotClass(position)}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex justify-center gap-8">
                <motion.div
                    className="border-default-300 flex h-16 w-16 items-center justify-center rounded-lg border-2 bg-white shadow-lg"
                    animate={
                        showAnimation
                            ? {
                                  rotateX: [0, 360, 720, 1080],
                                  rotateY: [0, 360, 720, 1080],
                                  scale: [1, 1.2, 0.8, 1],
                              }
                            : {}
                    }
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                    {renderDiceFace(diceValues[0])}
                </motion.div>

                <motion.div
                    className="border-default-300 flex h-16 w-16 items-center justify-center rounded-lg border-2 bg-white shadow-lg"
                    animate={
                        showAnimation
                            ? {
                                  rotateX: [0, -360, -720, -1080],
                                  rotateY: [0, -360, -720, -1080],
                                  scale: [1, 0.8, 1.2, 1],
                              }
                            : {}
                    }
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                    {renderDiceFace(diceValues[1])}
                </motion.div>
            </div>

            {state.history.length > 0 && !state.isRolling && (
                <div className="text-center">
                    <p className="text-lg font-semibold">
                        {diceValues[0]} + {diceValues[1]} = {diceValues[0] + diceValues[1]}
                    </p>
                </div>
            )}
        </div>
    );
};
