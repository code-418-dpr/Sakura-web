import React, { useCallback, useEffect, useState } from "react";

import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    addToast,
    useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import { GameKeyboard } from "./game-keyboard";
import { GameRow } from "./game-row";
import { wordList } from "./word-list";

// Максимальное количество попыток
const MAX_ATTEMPTS = 6;

// Очки за угадывание в зависимости от номера попытки
const POINTS_MULTIPLIER = {
    1: 10, // 1-я попытка: 10x очков
    2: 5, // 2-я попытка: 5x очков
    3: 3, // 3-я попытка: 3x очков
    4: 2, // 4-я попытка: 2x очков
    5: 1.5, // 5-я попытка: 1.5x очков
    6: 1, // 6-я попытка: 1x очков
};

// Базовые очки за угаданное слово
const BASE_POINTS = 100;

type LetterState = "correct" | "present" | "absent" | "empty";

interface GameState {
    targetWord: string;
    currentAttempt: number;
    currentGuess: string;
    guesses: string[];
    gameStatus: "playing" | "won" | "lost";
    letterStates: Record<string, LetterState>;
    score: number;
    totalScore: number;
}

export const WordGame: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(() => ({
        targetWord: getRandomWord(),
        currentAttempt: 0,
        currentGuess: "",
        guesses: Array<string>(MAX_ATTEMPTS).fill(""),
        gameStatus: "playing",
        letterStates: {},
        score: 0,
        totalScore: 0,
    }));

    const { isOpen, onOpen, onClose } = useDisclosure();

    // Получить случайное слово
    function getRandomWord(): string {
        return wordList[Math.floor(Math.random() * wordList.length)].toLowerCase();
    }

    // Отправить текущее предположение (устойчивый колбэк)
    const submitGuess = useCallback(() => {
        setGameState((prev) => {
            if (prev.currentGuess.length !== 5) {
                return prev;
            }
            if (!wordList.includes(prev.currentGuess.toLowerCase())) {
                addToast({
                    title: "Неверное слово",
                    description: "Введённого слова не существует",
                    color: "warning",
                    timeout: 3000,
                    shouldShowTimeoutProgress: true,
                });
                return prev;
            }

            const newGuesses = [...prev.guesses];
            newGuesses[prev.currentAttempt] = prev.currentGuess;

            // Маркируем все буквы как absent
            const newLetterStates = { ...prev.letterStates };
            for (const ch of prev.currentGuess) {
                newLetterStates[ch] = "absent";
            }
            // Отмечаем correct
            for (let i = 0; i < prev.currentGuess.length; i++) {
                const l = prev.currentGuess[i];
                if (l === prev.targetWord[i]) {
                    newLetterStates[l] = "correct";
                }
            }
            // Отмечаем present
            for (let i = 0; i < prev.currentGuess.length; i++) {
                const l = prev.currentGuess[i];
                if (l !== prev.targetWord[i] && prev.targetWord.includes(l)) {
                    if (newLetterStates[l] !== "correct") {
                        newLetterStates[l] = "present";
                    }
                }
            }

            const nextAttempt = prev.currentAttempt + 1;
            const isCorrect = prev.currentGuess === prev.targetWord;
            const multiplier = POINTS_MULTIPLIER[nextAttempt as keyof typeof POINTS_MULTIPLIER] || 1;
            const earned = isCorrect ? BASE_POINTS * multiplier : 0;

            const nextState: GameState = {
                ...prev,
                guesses: newGuesses,
                currentGuess: "",
                currentAttempt: nextAttempt,
                gameStatus: isCorrect ? "won" : nextAttempt >= MAX_ATTEMPTS ? "lost" : "playing",
                letterStates: newLetterStates,
                score: earned,
                totalScore: prev.totalScore + earned,
            };

            if (isCorrect || nextAttempt >= MAX_ATTEMPTS) {
                setTimeout(onOpen, 1000);
            }

            return nextState;
        });
    }, [onOpen]);

    // Обработка нажатия клавиш (устойчивый колбэк)
    const handleKeyPress = useCallback(
        (key: string) => {
            setGameState((prev) => {
                if (prev.gameStatus !== "playing") {
                    return prev;
                }
                if (key === "Enter") {
                    submitGuess();
                    return prev;
                }
                if (key === "Backspace") {
                    if (prev.currentGuess.length > 0) {
                        return { ...prev, currentGuess: prev.currentGuess.slice(0, -1) };
                    }
                    return prev;
                }
                if (/^[а-яёa-z]$/i.test(key) && prev.currentGuess.length < 5) {
                    return { ...prev, currentGuess: prev.currentGuess + key.toLowerCase() };
                }
                return prev;
            });
        },
        [submitGuess],
    );

    // Вешаем глобальный слушатель один раз
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            handleKeyPress(e.key);
        };
        window.addEventListener("keydown", handler);
        return () => {
            window.removeEventListener("keydown", handler);
        };
    }, [handleKeyPress]);

    // Начать новую игру
    const startNewGame = () => {
        setGameState((prev) => ({
            ...prev,
            targetWord: getRandomWord(),
            currentAttempt: 0,
            currentGuess: "",
            guesses: Array<string>(MAX_ATTEMPTS).fill(""),
            gameStatus: "playing",
            letterStates: {},
            score: 0,
        }));
        onClose();
    };

    return (
        <div className="flex w-full max-w-md flex-col items-center">
            <Card className="w-full shadow-md">
                <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon icon="lucide:award" className="text-primary" />
                        <span className="font-semibold">Общий счёт: {gameState.totalScore}</span>
                    </div>
                    <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={startNewGame}
                        startContent={<Icon icon="lucide:refresh-cw" />}
                    >
                        Новая игра
                    </Button>
                </CardHeader>
                <CardBody className="flex flex-col items-center gap-2">
                    <div className="mx-auto grid w-full max-w-xs grid-rows-6 gap-2">
                        {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => (
                            <GameRow
                                key={rowIndex}
                                word={
                                    rowIndex === gameState.currentAttempt
                                        ? gameState.currentGuess.padEnd(5, " ")
                                        : gameState.guesses[rowIndex]
                                }
                                targetWord={gameState.targetWord}
                                isSubmitted={rowIndex < gameState.currentAttempt}
                            />
                        ))}
                    </div>
                </CardBody>
                <CardFooter className="flex flex-col">
                    <GameKeyboard onKeyPress={handleKeyPress} letterStates={gameState.letterStates} />
                </CardFooter>
            </Card>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        {gameState.gameStatus === "won" ? "Поздравляем!" : "Игра окончена"}
                    </ModalHeader>
                    <ModalBody>
                        {gameState.gameStatus === "won" ? (
                            <div className="text-center">
                                <p className="mb-2 text-lg">
                                    Вы угадали слово за {gameState.currentAttempt}{" "}
                                    {gameState.currentAttempt === 1
                                        ? "попытку"
                                        : gameState.currentAttempt <= 4
                                          ? "попытки"
                                          : "попыток"}
                                    !
                                </p>
                                <p className="text-primary mb-4 text-2xl font-bold">+{gameState.score} очков!</p>
                                <p className="text-default-500 text-sm">
                                    Множитель:{" "}
                                    {POINTS_MULTIPLIER[gameState.currentAttempt as keyof typeof POINTS_MULTIPLIER]}x
                                </p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="mb-4 text-lg">
                                    Слово было: <span className="font-bold">{gameState.targetWord.toUpperCase()}</span>
                                </p>
                                <p className="text-default-500 text-sm">Удачи в следующий раз!</p>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onPress={startNewGame}>
                            Играть снова
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};
