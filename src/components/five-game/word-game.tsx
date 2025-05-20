import React from "react";

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

// Maximum number of attempts allowed
const MAX_ATTEMPTS = 6;

// Points awarded based on attempt number
const POINTS_MULTIPLIER = {
    1: 10, // 1st attempt: 10x points
    2: 5, // 2nd attempt: 5x points
    3: 3, // 3rd attempt: 3x points
    4: 2, // 4th attempt: 2x points
    5: 1.5, // 5th attempt: 1.5x points
    6: 1, // 6th attempt: 1x points
};

// Base points for guessing the word
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
    const [gameState, setGameState] = React.useState<GameState>(() => ({
        targetWord: getRandomWord(),
        currentAttempt: 0,
        currentGuess: "",
        guesses: Array(MAX_ATTEMPTS).fill("") as string[],
        gameStatus: "playing",
        letterStates: {},
        score: 0,
        totalScore: 0,
    }));

    const { isOpen, onOpen, onClose } = useDisclosure();

    // Get a random word from the word list
    const getRandomWord = React.useCallback((): string => {
        return wordList[Math.floor(Math.random() * wordList.length)].toLowerCase();
    }, []);

    // Submit the current guess
    const submitGuess = React.useCallback(() => {
        if (gameState.currentGuess.length !== 5) return;

        if (!wordList.includes(gameState.currentGuess.toLowerCase())) {
            addToast({
                title: "Не верное слово",
                description: "Введённого слова не существует",
                color: "warning",
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
            return;
        }

        const newGuesses = [...gameState.guesses];
        newGuesses[gameState.currentAttempt] = gameState.currentGuess;

        const isCorrect = gameState.currentGuess.toLowerCase() === gameState.targetWord;
        const newLetterStates = { ...gameState.letterStates };

        for (const letter of gameState.currentGuess) {
            newLetterStates[letter.toLowerCase()] = "absent";
        }

        for (let i = 0; i < gameState.currentGuess.length; i++) {
            const letter = gameState.currentGuess[i].toLowerCase();
            if (letter === gameState.targetWord[i]) {
                newLetterStates[letter] = "correct";
            }
        }

        for (let i = 0; i < gameState.currentGuess.length; i++) {
            const letter = gameState.currentGuess[i].toLowerCase();
            if (letter !== gameState.targetWord[i] && gameState.targetWord.includes(letter)) {
                if (newLetterStates[letter] !== "correct") {
                    newLetterStates[letter] = "present";
                }
            }
        }

        let earnedPoints = 0;
        if (isCorrect) {
            const attemptNumber = gameState.currentAttempt + 1;
            const multiplier = POINTS_MULTIPLIER[attemptNumber as keyof typeof POINTS_MULTIPLIER] || 1;
            earnedPoints = BASE_POINTS * multiplier;
        }

        setGameState((prev) => ({
            ...prev,
            guesses: newGuesses,
            currentGuess: "",
            currentAttempt: prev.currentAttempt + 1,
            gameStatus: isCorrect ? "won" : prev.currentAttempt + 1 >= MAX_ATTEMPTS ? "lost" : "playing",
            letterStates: newLetterStates,
            score: earnedPoints,
            totalScore: prev.totalScore + earnedPoints,
        }));

        if (isCorrect || gameState.currentAttempt + 1 >= MAX_ATTEMPTS) {
            setTimeout(() => {
                onOpen();
            }, 1000);
        }
    }, [gameState, onOpen]);

    // Handle keyboard input
    const handleKeyPress = React.useCallback(
        (key: string) => {
            if (gameState.gameStatus !== "playing") return;

            if (key === "Enter") {
                submitGuess();
            } else if (key === "Backspace") {
                if (gameState.currentGuess.length > 0) {
                    setGameState((prev) => ({
                        ...prev,
                        currentGuess: prev.currentGuess.slice(0, -1),
                    }));
                }
            } else if (/^[a-z]$/i.test(key) && gameState.currentGuess.length < 5) {
                setGameState((prev) => ({
                    ...prev,
                    currentGuess: prev.currentGuess + key.toLowerCase(),
                }));
            }
        },
        [gameState, submitGuess],
    );

    // Start a new game
    const startNewGame = () => {
        setGameState((prev) => ({
            ...prev,
            targetWord: getRandomWord(),
            currentAttempt: 0,
            currentGuess: "",
            guesses: Array(MAX_ATTEMPTS).fill("") as string[],
            gameStatus: "playing",
            letterStates: {},
            score: 0,
        }));
        onClose();
    };

    // Handle physical keyboard input
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                submitGuess();
            } else if (e.key === "Backspace") {
                handleKeyPress("Backspace");
            } else if (/^[a-z]$/i.test(e.key)) {
                handleKeyPress(e.key);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [gameState, handleKeyPress, submitGuess]);

    return (
        <div className="flex w-full max-w-md flex-col items-center">
            <Card className="w-full shadow-md">
                <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon icon="lucide:award" className="text-primary" />
                        <span className="font-semibold">Total Score: {gameState.totalScore}</span>
                    </div>
                    <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={startNewGame}
                        startContent={<Icon icon="lucide:refresh-cw" />}
                    >
                        New Game
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

            {/* Results Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        {gameState.gameStatus === "won" ? "Congratulations!" : "Game Over"}
                    </ModalHeader>
                    <ModalBody>
                        {gameState.gameStatus === "won" ? (
                            <div className="text-center">
                                <p className="mb-2 text-lg">
                                    You guessed the word in {gameState.currentAttempt}{" "}
                                    {gameState.currentAttempt === 1 ? "attempt" : "attempts"}!
                                </p>
                                <p className="text-primary mb-4 text-2xl font-bold">+{gameState.score} points!</p>
                                <p className="text-default-500 text-sm">
                                    Multiplier:{" "}
                                    {POINTS_MULTIPLIER[gameState.currentAttempt as keyof typeof POINTS_MULTIPLIER]}x
                                </p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="mb-4 text-lg">
                                    The word was:{" "}
                                    <span className="font-bold">{gameState.targetWord.toUpperCase()}</span>
                                </p>
                                <p className="text-default-500 text-sm">Better luck next time!</p>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onPress={startNewGame}>
                            Play Again
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};
