import React from "react";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

type LetterState = "correct" | "present" | "absent" | "empty";

interface GameKeyboardProps {
    onKeyPress: (key: string) => void;
    letterStates: Record<string, LetterState>;
}

export const GameKeyboard: React.FC<GameKeyboardProps> = ({ onKeyPress, letterStates }) => {
    const keyboardRows = [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
    ];

    const getKeyStyle = (key: string) => {
        if (key === "Enter" || key === "Backspace") {
            return "bg-default-100";
        }

        switch (letterStates[key]) {
            case "correct":
                return "bg-success-500 text-white";
            case "present":
                return "bg-warning-500 text-black";
            case "absent":
                return "bg-default-300";
            default:
                return "bg-default-100";
        }
    };

    return (
        <div className="mx-auto w-full max-w-md">
            {keyboardRows.map((row, rowIndex) => (
                <div key={rowIndex} className="my-1 flex justify-center gap-1">
                    {row.map((key) => (
                        <Button
                            key={key}
                            size="sm"
                            className={`h-12 min-w-[36px] font-medium ${getKeyStyle(key.toLowerCase())}`}
                            onPress={() => {
                                onKeyPress(key);
                            }}
                        >
                            {key === "Backspace" ? <Icon icon="lucide:delete" width={20} height={20} /> : key}
                        </Button>
                    ))}
                </div>
            ))}
        </div>
    );
};
