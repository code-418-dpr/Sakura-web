"use client";

import { motion } from "framer-motion";

import React, { useEffect, useRef, useState } from "react";

import { scratchCardPrizes } from "@/app/games/data/prizes";
import Confetti from "@/components/Confetti";
import PrizeDisplay from "@/components/PrizeDisplay";
import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

const ScratchCard: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const revealedRef = useRef(false);

    const [prize, setPrize] = useState<string | null>(null);
    const [showPrize, setShowPrize] = useState(false);
    const [isScratching, setIsScratching] = useState(false);
    const [percentScratched, setPercentScratched] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * scratchCardPrizes.length);
        setPrize(scratchCardPrizes[randomIndex]);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !prize) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.fillStyle = "#FFB7D5";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#FFD7E5";
        ctx.lineWidth = 3;

        for (let i = 0; i < 10; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = 10 + Math.random() * 20;

            ctx.beginPath();
            for (let j = 0; j < 5; j++) {
                const angle = (j * 2 * Math.PI) / 5;
                const innerRadius = size / 2;
                const outerRadius = size;

                const startX = x + innerRadius * Math.cos(angle);
                const startY = y + innerRadius * Math.sin(angle);

                const endX = x + outerRadius * Math.cos(angle + Math.PI / 5);
                const endY = y + outerRadius * Math.sin(angle + Math.PI / 5);

                if (j === 0) {
                    ctx.moveTo(startX, startY);
                } else {
                    ctx.lineTo(startX, startY);
                }

                ctx.quadraticCurveTo(x, y, endX, endY);
            }
            ctx.closePath();
            ctx.stroke();
        }

        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "#7828c8";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Scratch Here!", canvas.width / 2, canvas.height / 2);

        let isDrawing = false;
        const scratchedPixels = new Set<number>();
        const totalPixels = canvas.width * canvas.height;

        const scratch = (x: number, y: number) => {
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();

            for (let i = x - 20; i < x + 20; i++) {
                for (let j = y - 20; j < y + 20; j++) {
                    const dist = Math.sqrt((i - x) ** 2 + (j - y) ** 2);
                    if (dist <= 20 && i >= 0 && i < canvas.width && j >= 0 && j < canvas.height) {
                        scratchedPixels.add(i + j * canvas.width);
                    }
                }
            }

            const percent = (scratchedPixels.size / totalPixels) * 100;
            setPercentScratched(percent);

            if (percent > 50 && !revealedRef.current) {
                revealedRef.current = true;
                setShowPrize(true);
                setShowConfetti(true);
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            isDrawing = true;
            setIsScratching(true);
            const rect = canvas.getBoundingClientRect();
            scratch(e.clientX - rect.left, e.clientY - rect.top);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            scratch(e.clientX - rect.left, e.clientY - rect.top);
        };

        const handleMouseUp = () => {
            isDrawing = false;
            setIsScratching(false);
        };

        const handleTouchStart = (e: TouchEvent) => {
            isDrawing = true;
            setIsScratching(true);
            const rect = canvas.getBoundingClientRect();
            scratch(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDrawing) return;
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            scratch(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
        };

        const handleTouchEnd = () => {
            isDrawing = false;
            setIsScratching(false);
        };

        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mouseleave", handleMouseUp);

        canvas.addEventListener("touchstart", handleTouchStart);
        canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
        canvas.addEventListener("touchend", handleTouchEnd);

        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mouseleave", handleMouseUp);

            canvas.removeEventListener("touchstart", handleTouchStart);
            canvas.removeEventListener("touchmove", handleTouchMove);
            canvas.removeEventListener("touchend", handleTouchEnd);
        };
    }, [prize]);

    const resetCard = () => {
        revealedRef.current = false;
        setShowPrize(false);
        setPercentScratched(0);
        setShowConfetti(false);

        const randomIndex = Math.floor(Math.random() * scratchCardPrizes.length);
        setPrize(scratchCardPrizes[randomIndex]);
    };

    return (
        <div className="flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 w-full max-w-md text-center"
            >
                <p className="text-lg">
                    Scratch the card below to reveal your prize! Use your finger or mouse to scratch off the covering.
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
                        <div className="relative h-64 overflow-hidden rounded-lg">
                            {/* Prize display underneath */}
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white">
                                <div className="p-4 text-center">
                                    <Icon icon="lucide:gift" className="text-primary mb-2 text-4xl" />
                                    <h3 className="text-primary mb-2 text-2xl font-bold">Your Prize</h3>
                                    <p className="text-xl">{prize}</p>
                                </div>
                            </div>

                            {/* Scratch layer */}
                            <canvas
                                ref={canvasRef}
                                className="absolute inset-0 h-full w-full rounded-lg"
                                style={{ cursor: isScratching ? "none" : "pointer" }}
                            />
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <div className="bg-content2 h-2.5 w-full max-w-xs rounded-full">
                                <div
                                    className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${percentScratched}%` }}
                                ></div>
                            </div>
                            <span className="ml-4 text-sm">{Math.round(percentScratched)}%</span>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Button
                                color="primary"
                                onPress={resetCard}
                                startContent={<Icon icon="lucide:refresh-cw" />}
                            >
                                New Card
                            </Button>
                        </div>
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

export default ScratchCard;
