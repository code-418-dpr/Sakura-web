import React from "react";

export type GameMode = "HighLow" | "Exact" | "Par" | null;

export interface GameRound {
    id: number;
    bet: number;
    mode: GameMode;
    goal?: number;
    dice1?: number;
    dice2?: number;
    result: "win" | "loss" | "pending";
    winAmount?: number;
    timestamp: Date;
}

interface GameState {
    balance: number;
    currentBet: number;
    selectedMode: GameMode;
    goalNumber?: number;
    isRolling: boolean;
    history: GameRound[];
    currentRound: GameRound | null;
    message: string;
}

interface GameContextType {
    state: GameState;
    placeBet: (amount: number, mode: GameMode, goal?: number) => void;
    rollDice: () => void;
    updateBet: (amount: string) => void;
    setMode: (mode: GameMode) => void;
    setGoal: (goal: string) => void;
    resetGame: () => void;
}

const initialState: GameState = {
    balance: 1000, // Starting balance
    currentBet: 50, // Default bet
    selectedMode: null,
    goalNumber: undefined,
    isRolling: false,
    history: [],
    currentRound: null,
    message: "Welcome to Cube Battle! Place your bet and choose a mode to begin.",
};

export const GameContext = React.createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = React.useState<GameState>(initialState);

    const placeBet = (amount: number, mode: GameMode, goal?: number) => {
        if (amount <= 0 || amount > state.balance) {
            setState((prev) => ({
                ...prev,
                message: `Invalid bet amount. You have ${prev.balance} coins.`,
            }));
            return;
        }

        if (mode === "HighLow" && (goal === undefined || goal < 2 || goal > 12)) {
            setState((prev) => ({
                ...prev,
                message: "For High & Low mode, you need to choose a number between 2 and 12.",
            }));
            return;
        }

        if (mode === "Exact" && (goal === undefined || goal < 2 || goal > 12)) {
            setState((prev) => ({
                ...prev,
                message: "For Precisely mode, you need to choose a number between 2 and 12.",
            }));
            return;
        }

        const newRound: GameRound = {
            id: Date.now(),
            bet: amount,
            mode,
            goal,
            result: "pending",
            timestamp: new Date(),
        };

        setState((prev) => ({
            ...prev,
            balance: prev.balance - amount,
            currentRound: newRound,
            message: `Bet placed! ${amount} coins on ${mode}${goal !== undefined ? ` with goal ${goal}` : ""}. Roll the dice!`,
        }));
    };

    const rollDice = () => {
        if (!state.currentRound) {
            setState((prev) => ({
                ...prev,
                message: "Place a bet first!",
            }));
            return;
        }

        setState((prev) => ({ ...prev, isRolling: true }));

        // Simulate dice roll animation
        setTimeout(() => {
            const dice1 = Math.floor(Math.random() * 6) + 1;
            const dice2 = Math.floor(Math.random() * 6) + 1;
            const sum = dice1 + dice2;

            let result: "win" | "loss" = "loss";
            let winAmount = 0;
            let resultMessage = "";

            const { mode, goal, bet } = state.currentRound!;

            if (mode === "HighLow" && goal !== undefined) {
                if ((goal < sum && goal < 7) || (goal > sum && goal >= 7)) {
                    result = "win";
                    winAmount = Math.floor(bet * 1.9);
                    resultMessage = `The sum is ${sum}, which is ${goal < 7 ? "higher" : "lower"} than ${goal}. You win ${winAmount} coins!`;
                } else {
                    resultMessage = `The sum is ${sum}, which is ${goal < 7 ? "not higher" : "not lower"} than ${goal}. You lose ${bet} coins.`;
                }
            } else if (mode === "Exact" && goal !== undefined) {
                if (sum === goal) {
                    result = "win";
                    winAmount = bet * 7;
                    resultMessage = `The sum is exactly ${sum}! You win ${winAmount} coins!`;
                } else {
                    resultMessage = `The sum is ${sum}, not ${goal}. You lose ${bet} coins.`;
                }
            } else if (mode === "Par") {
                const isEven = sum % 2 === 0;
                if ((goal === 2 && isEven) || (goal === 3 && !isEven)) {
                    result = "win";
                    winAmount = Math.floor(bet * 1.8);
                    resultMessage = `The sum is ${sum}, which is ${isEven ? "even" : "odd"}. You win ${winAmount} coins!`;
                } else {
                    resultMessage = `The sum is ${sum}, which is ${isEven ? "even" : "odd"}. You lose ${bet} coins.`;
                }
            }

            const updatedRound: GameRound = {
                ...state.currentRound!,
                dice1,
                dice2,
                result,
                winAmount,
            };

            const newBalance = state.balance + (result === "win" ? winAmount : 0);
            const newHistory = [updatedRound, ...state.history].slice(0, 10);

            setState((prev) => ({
                ...prev,
                balance: newBalance,
                history: newHistory,
                currentRound: null,
                isRolling: false,
                message: `${resultMessage} Your balance is now ${newBalance} coins. Would you like to play again?`,
            }));
        }, 2000);
    };

    const updateBet = (amount: string) => {
        const numAmount = parseInt(amount);
        if (!isNaN(numAmount) && numAmount > 0) {
            setState((prev) => ({ ...prev, currentBet: numAmount }));
        }
    };

    const setMode = (mode: GameMode) => {
        setState((prev) => ({
            ...prev,
            selectedMode: mode,
            goalNumber: mode === "Par" ? 2 : undefined, // Default to "even" for Par mode
        }));
    };

    const setGoal = (goal: string) => {
        const numGoal = parseInt(goal);
        if (!isNaN(numGoal)) {
            setState((prev) => ({ ...prev, goalNumber: numGoal }));
        }
    };

    const resetGame = () => {
        setState((prev) => ({
            ...prev,
            currentBet: 50,
            selectedMode: null,
            goalNumber: undefined,
            currentRound: null,
            message: "Ready for a new game? Place your bet and choose a mode!",
        }));
    };

    const contextValue: GameContextType = {
        state,
        placeBet,
        rollDice,
        updateBet,
        setMode,
        setGoal,
        resetGame,
    };

    return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

export const useGame = () => {
    const context = React.useContext(GameContext);
    if (context === undefined) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
};
