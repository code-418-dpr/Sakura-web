import React from "react";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

// Состояние букв: угадана / есть в слове / отсутствует / пустая
type LetterState = "correct" | "present" | "absent" | "empty";

// Пропсы для клавиатуры
interface GameKeyboardProps {
    onKeyPress: (key: string) => void; // Обработчик нажатия клавиш
    letterStates: Record<string, LetterState>; // Состояния букв
}

export const GameKeyboard: React.FC<GameKeyboardProps> = ({ onKeyPress, letterStates }) => {
    // Раскладка клавиатуры
    const keyboardRows = [
        ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з"],
        ["ф", "ы", "в", "а", "п", "р", "о", "л", "д"],
        ["Enter", "я", "ч", "с", "м", "и", "т", "ь", "Backspace"],
    ];

    // Получить стиль кнопки в зависимости от состояния буквы
    const getKeyStyle = (key: string) => {
        if (key === "Enter" || key === "Backspace") {
            return "bg-default-100";
        }

        switch (letterStates[key]) {
            case "correct": // Буква на правильном месте
                return "bg-success-500 text-white";
            case "present": // Буква есть в слове, но не на своём месте
                return "bg-warning-500 text-black";
            case "absent": // Буквы нет в слове
                return "bg-default-300";
            default: // Не проверенная буква
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
