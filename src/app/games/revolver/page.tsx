"use client";

import React, { useEffect, useRef, useState } from "react";

import ModalOrDrawer from "@/components/modal-or-drawer";
import { updateUser } from "@/data/user";
import { useAuth } from "@/hooks/use-auth";
import { Button, Image, addToast, useDisclosure } from "@heroui/react";

function createRandomBinaryArray(length = 6, onesCount = 2): number[] {
    // Создаем массив с нулями
    const arr = new Array<number>(length).fill(0);

    // Расставляем единицы в случайных позициях
    for (let i = 0; i < onesCount; i++) {
        let randomIndex;
        // Ищем случайную пустую позицию (где еще 0)
        do {
            randomIndex = Math.floor(Math.random() * length);
        } while (arr[randomIndex] === 1);

        arr[randomIndex] = 1;
    }

    return arr;
}

export default function RevolverPage() {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { isOpen: isShootOpen, onOpen: onShootOpen, onOpenChange: onShootOpenChange } = useDisclosure();
    const maxBullets = 6;
    const [bulletsIn, setBulletsIn] = useState<number>(1);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotationSpeed, setRotationSpeed] = useState(0);
    const [rotationAngle, setRotationAngle] = useState(0);
    const animationRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const [prize, setPrize] = useState<string>("");

    const getRandomValue = (low: number, hi: number) => Math.floor(Math.random() * hi) + low;

    const handleSpin = () => {
        setIsSpinning(true);
        if (rotationSpeed > 0) return;
        const randomNumber = getRandomValue(1, 6);
        const revolver = createRandomBinaryArray(6, bulletsIn);

        setPrize(revolver[randomNumber] === 1 ? "Автомобиль" : "К сожалению это был холостой");

        startTimeRef.current = Date.now();
        setRotationSpeed(100); // Начальная скорость (градусов в секунду)
        animate();
    };

    const animate = () => {
        const now = Date.now();
        const elapsed = (now - startTimeRef.current) / 1000;

        const newSpeed = Math.max(0, 100 - elapsed * 20);

        if (newSpeed <= 0) {
            cancelAnimationFrame(animationRef.current);
            setRotationSpeed(0);
            const finalAngle = Math.round(rotationAngle / 60) * 60;
            setRotationAngle(finalAngle);
            setIsSpinning(false);
            onShootOpen();
            return;
        }

        setRotationSpeed(newSpeed);
        setRotationAngle((prev) => prev + newSpeed * 0.016);

        animationRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <div className="flex w-full flex-col items-center text-center md:w-[40%]">
            <Image
                alt="Sakura Logo"
                src="/sakura.png"
                className="mb-4 h-auto w-32 md:w-40 lg:w-48"
                style={{
                    transform: `rotate(${rotationAngle}deg)`,
                    transition: rotationSpeed > 1 ? "transform 0.016s linear" : "none",
                }}
            />
            <p>
                Патронов в барабане: {bulletsIn} из {maxBullets}
            </p>
            <div className="mt-2 flex w-full justify-center gap-1">
                <Button
                    color="primary"
                    size="lg"
                    radius="full"
                    className="h-20 w-48 font-semibold"
                    onPress={onOpen}
                    isDisabled={bulletsIn === 3}
                >
                    Загрузить
                    <br />
                    ещё патрон
                </Button>
                <ModalOrDrawer label="Подтверждение" isOpen={isOpen} onOpenChangeAction={onOpenChange}>
                    <AcceptAddBullet bulletsIn={bulletsIn} setBulletsIn={setBulletsIn} onClose={onClose} />
                </ModalOrDrawer>
                <Button
                    color="primary"
                    size="lg"
                    radius="full"
                    className="h-20 w-48 font-semibold"
                    onPress={handleSpin}
                    isDisabled={isSpinning}
                >
                    Прокрутить
                    <br />
                    барабан
                </Button>
                <ModalOrDrawer label="Совершен выстрел" isOpen={isShootOpen} onOpenChangeAction={onShootOpenChange}>
                    <p>Выстрел был совершен, Ваш приз: {prize}</p>
                </ModalOrDrawer>
            </div>
        </div>
    );
}

interface AcceptProps {
    bulletsIn: number;
    setBulletsIn: React.Dispatch<React.SetStateAction<number>>;
    onClose: () => void;
}

function AcceptAddBullet({ bulletsIn, setBulletsIn, onClose }: AcceptProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { user, update } = useAuth();

    const handleAccept = async () => {
        try {
            setIsLoading(true);
            if (!user) return null;

            await updateUser(user.id, Number(user.realBalance) - 50 * bulletsIn, Number(user.virtualBalance));

            await update();

            setBulletsIn(bulletsIn + 1);
            onClose();
        } catch (error: unknown) {
            // Явно указываем тип unknown
            console.log(error);
            let errorMessage = "Произошла неизвестная ошибка";

            if (error instanceof Error) {
                // Проверяем, является ли ошибка экземпляром Error
                errorMessage = error.message;
            }

            addToast({
                title: "Ошибка",
                description: errorMessage, // Используем безопасное сообщение
                color: "danger",
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAcceptSubmit = () => {
        handleAccept().catch(console.error);
    };

    return (
        <>
            <p>Вы уверены что хотите добавить себе патрон за {50 * bulletsIn} руб.?</p>
            <Button
                type="submit"
                color="success"
                isLoading={isLoading}
                fullWidth
                className="mt-6"
                onPress={handleAcceptSubmit}
            >
                Подтвердить
            </Button>
        </>
    );
}
