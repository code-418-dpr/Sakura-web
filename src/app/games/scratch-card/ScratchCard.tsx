"use client";

import { motion } from "framer-motion";

import React, { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import Confetti from "@/components/Confetti";
import { PrizeDisplay } from "@/components/PrizeDisplay";
import { updateUser } from "@/data/user";
import { useAuth } from "@/hooks/use-auth";
import { Button, Card, CardBody, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Icon } from "@iconify/react";

const ScratchCard: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const revealedRef = useRef(false);
    const router = useRouter();
    const { user, update: updateAuth } = useAuth();
    const [bonusAmount, setBonusAmount] = useState(0);
    const [showPrize, setShowPrize] = useState(false);
    const [isScratching, setIsScratching] = useState(false);
    const [percentScratched, setPercentScratched] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showCooldownModal, setShowCooldownModal] = useState(false);
    const [remainingTime, setRemainingTime] = useState("");
    const [shouldRedirect, setShouldRedirect] = useState(false);
    useEffect(() => {
        const lastPlayed = localStorage.getItem("scratch_last_played");
        if (lastPlayed) {
            const lastTime = parseInt(lastPlayed, 10);
            const currentTime = Date.now();

            if (currentTime - lastTime < 86400000) {
                setShowCooldownModal(true);
                startCooldownTimer(lastTime);
            }
        }
    }, []);
    useEffect(() => {
        if (shouldRedirect) {
            router.push("/games");
        }
    }, [router, shouldRedirect]);
    const checkCooldown = () => {
        const lastPlayed = localStorage.getItem("scratch_last_played");
        if (!lastPlayed) return false;

        const lastTime = parseInt(lastPlayed, 10);
        const currentTime = Date.now();
        return currentTime - lastTime < 86400000;
    };
    const handleCloseCooldownModal = () => {
        if (!checkCooldown()) {
            router.push("/games");
        }
        setShowCooldownModal(false);
    };
    useEffect(() => {
        if (showPrize) {
            void handleScratchComplete();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showPrize]);
    useEffect(() => {
        if (checkCooldown()) {
            const lastTime = parseInt(localStorage.getItem("scratch_last_played")!, 10);
            setShowCooldownModal(true);
            startCooldownTimer(lastTime);
        }
    }, []);
    const startCooldownTimer = (lastTime: number) => {
        const interval = setInterval(() => {
            const currentTime = Date.now();
            const diff = currentTime - lastTime;

            if (diff >= 86400000) {
                localStorage.removeItem("scratch_last_played");
                setShowCooldownModal(false);
                clearInterval(interval);
            } else {
                const remaining = 86400000 - diff;
                const hours = Math.floor(remaining / 3600000);
                const minutes = Math.floor((remaining % 3600000) / 60000);
                const seconds = Math.floor((remaining % 60000) / 1000);
                setRemainingTime(`${hours}ч ${minutes}м ${seconds}с`);
            }
        }, 1000);
    };

    useEffect(() => {
        setBonusAmount(Math.floor(Math.random() * 70) + 5);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !bonusAmount) return;

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
    }, [bonusAmount]);
    const handleScratchComplete = async () => {
        try {
            await updateUser(user!.id, Number(user!.realBalance), Number(user!.virtualBalance) + bonusAmount);
            await updateAuth();
            localStorage.setItem("scratch_last_played", Date.now().toString());
            setShowConfetti(true);
            setShowPrize(true);
        } catch (error) {
            console.error("Ошибка обновления баланса:", error);
        }
    };
    const resetCard = () => {
        if (showCooldownModal) return;

        revealedRef.current = false;
        setShowPrize(false);
        setPercentScratched(0);
        setShowConfetti(false);
        setBonusAmount(Math.floor(Math.random() * 70) + 5);
    };

    return (
        <div className="flex flex-col items-center">
            <Modal isOpen={showCooldownModal} hideCloseButton>
                <ModalContent>
                    <ModalHeader>Пожалуйста, подождите</ModalHeader>
                    <ModalBody>
                        <p className="text-center">
                            Вы сможете сыграть снова через: <br />
                            <span className="text-primary font-bold">{remainingTime}</span>
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button fullWidth color="primary" onPress={handleCloseCooldownModal}>
                            Вернуться к играм
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
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
                                    <h3 className="text-primary mb-2 text-2xl font-bold">Твоой приз</h3>
                                    <p className="text-xl">{bonusAmount}</p>
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
                                isDisabled={showCooldownModal}
                            >
                                Новая карта
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </motion.div>

            <Confetti active={showConfetti} />
            <PrizeDisplay
                prize={showPrize ? `${bonusAmount} бонусов` : null}
                onClose={() => {
                    setShowPrize(false);
                    if (checkCooldown()) {
                        setShowCooldownModal(true);
                        startCooldownTimer(Date.now());
                    } else {
                        setShouldRedirect(true);
                    }
                }}
            />
        </div>
    );
};

export default ScratchCard;
