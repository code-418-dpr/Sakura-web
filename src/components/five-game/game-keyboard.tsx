import React from "react";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

// Состояние букв: угадана / есть в слове / отсутствует / пустая
type LetterState = "correct" | "present" | "absent" | "empty";

// Пропсы для клавиатуры
interface GameKeyboardProps {
    onKeyPress: (key: string) => void;
    letterStates: Record<string, LetterState>;
}

export const GameKeyboard: React.FC<GameKeyboardProps> = ({ onKeyPress, letterStates }) => {
    // Полная раскладка клавиатуры
    const keyboardRows = [
        ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х"],
        ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"],
        ["Enter", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "Backspace"],
    ];

    const getKeyStyle = (key: string) => {
        const lower = key.toLowerCase();
        if (lower === "enter" || lower === "backspace") {
            return "bg-default-100";
        }
        switch (letterStates[lower]) {
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
        <div className="w-full px-2">
            {keyboardRows.map((row, i) => (
                <div key={i} className="my-1 flex justify-center gap-1">
                    {row.map((key) => (
                        <Button
                            key={key}
                            size="sm"
                            className={`h-12 min-w-[36px] font-medium ${getKeyStyle(key)}`}
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
