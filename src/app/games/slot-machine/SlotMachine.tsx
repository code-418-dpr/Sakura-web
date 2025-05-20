"use client";

import { motion, useAnimation } from "framer-motion";

import React, { useState } from "react";

import Confetti from "@/components/Confetti";
import { PrizeDisplay } from "@/components/PrizeDisplay";
import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

import { slotMachinePrizes, slotMachineSymbols } from "../data/prizes";

const SlotMachine: React.FC = () => {
    const [reels, setReels] = useState<string[][]>([
        [slotMachineSymbols[0], slotMachineSymbols[1], slotMachineSymbols[2]],
        [slotMachineSymbols[0], slotMachineSymbols[1], slotMachineSymbols[2]],
        [slotMachineSymbols[0], slotMachineSymbols[1], slotMachineSymbols[2]],
    ]);
    const [spinning, setSpinning] = useState(false);
    const [results, setResults] = useState<string[]>([]);
    const [prize, setPrize] = useState<string | null>(null);
    const [showPrize, setShowPrize] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const controls1 = useAnimation();
    const controls2 = useAnimation();
    const controls3 = useAnimation();

    const spinReels = async () => {
        if (spinning) return;

        setSpinning(true);
        setPrize(null);
        setShowPrize(false);

        // Generate random symbols for each reel
        const newReels = reels.map(() => {
            const reelSymbols = [];
            for (let i = 0; i < 20; i++) {
                const randomIndex = Math.floor(Math.random() * slotMachineSymbols.length);
                reelSymbols.push(slotMachineSymbols[randomIndex]);
            }
            return reelSymbols;
        });

        setReels(newReels);

        // Animate each reel with different durations
        await controls1.start({
            y: [-2000, 0],
            transition: { duration: 2, ease: "easeOut" },
        });

        await controls2.start({
            y: [-2000, 0],
            transition: { duration: 2.5, ease: "easeOut" },
        });

        await controls3.start({
            y: [-2000, 0],
            transition: { duration: 3, ease: "easeOut" },
        });

        // Get the final results
        const finalResults = [
            newReels[0][newReels[0].length - 3],
            newReels[1][newReels[1].length - 3],
            newReels[2][newReels[2].length - 3],
        ];

        setResults(finalResults);

        // Check if there's a winning combination
        const resultKey = finalResults.join("");
        const winningPrize = slotMachinePrizes[resultKey as keyof typeof slotMachinePrizes];

        if (winningPrize) {
            setPrize(winningPrize);
            setShowPrize(true);
            setShowConfetti(true);
        }

        setSpinning(false);
    };

    return (
        <div className="flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 w-full max-w-md text-center"
            >
                <p className="text-lg">
                    Pull the lever and match three symbols to win exciting prizes! Match cherry blossoms for the grand
                    prize.
                </p>
            </motion.div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full max-w-md"
            >
                <Card className="sakura-bg sakura-border overflow-hidden">
                    <CardBody className="p-6">
                        <div className="mb-6 rounded-lg bg-white p-4">
                            <div className="flex justify-center gap-2">
                                <div className="slot-reel relative h-[180px] w-1/3 overflow-hidden">
                                    <motion.div animate={controls1} className="flex flex-col">
                                        {reels[0].map((symbol, index) => (
                                            <div
                                                key={index}
                                                className="slot-item flex h-[60px] items-center justify-center text-2xl"
                                            >
                                                {symbol}
                                            </div>
                                        ))}
                                    </motion.div>
                                </div>

                                <div className="slot-reel relative h-[180px] w-1/3 overflow-hidden">
                                    <motion.div animate={controls2} className="flex flex-col">
                                        {reels[1].map((symbol, index) => (
                                            <div
                                                key={index}
                                                className="slot-item flex h-[60px] items-center justify-center text-2xl"
                                            >
                                                {symbol}
                                            </div>
                                        ))}
                                    </motion.div>
                                </div>

                                <div className="slot-reel relative h-[180px] w-1/3 overflow-hidden">
                                    <motion.div animate={controls3} className="flex flex-col">
                                        {reels[2].map((symbol, index) => (
                                            <div
                                                key={index}
                                                className="slot-item flex h-[60px] items-center justify-center text-2xl"
                                            >
                                                {symbol}
                                            </div>
                                        ))}
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    color="primary"
                                    size="lg"
                                    isDisabled={spinning}
                                    onPress={() => {
                                        void spinReels();
                                    }}
                                    className="px-8"
                                    startContent={
                                        <Icon icon="lucide:refresh-cw" className={spinning ? "animate-spin" : ""} />
                                    }
                                >
                                    {spinning ? "Spinning..." : "Pull Lever"}
                                </Button>
                            </motion.div>
                        </div>

                        {results.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 text-center"
                            >
                                <p className="mb-2 text-lg font-semibold">Result:</p>
                                <div className="flex justify-center gap-4 text-4xl">
                                    {results.map((symbol, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.2 }}
                                            className="flex h-16 w-16 items-center justify-center rounded-lg bg-white shadow-md"
                                        >
                                            {symbol}
                                        </motion.div>
                                    ))}
                                </div>

                                {!prize && <p className="text-foreground/70 mt-4">Better luck next time!</p>}
                            </motion.div>
                        )}
                    </CardBody>
                </Card>
            </motion.div>

            <Confetti active={showConfetti} />
            <PrizeDisplay
                prize={showPrize ? prize : null}
                onClose={() => {
                    setShowPrize(false);
                }}
            />
        </div>
    );
};

export default SlotMachine;
