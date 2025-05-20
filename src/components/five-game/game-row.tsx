import React from "react";

interface GameRowProps {
    word: string;
    targetWord: string;
    isSubmitted: boolean;
}

export const GameRow: React.FC<GameRowProps> = ({ word, targetWord, isSubmitted }) => {
    return (
        <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, index) => {
                const letter = word[index] || "";
                let bgColor = "bg-content1";
                let textColor = "text-foreground";
                let borderColor = "border-default-200";

                if (isSubmitted && letter.trim()) {
                    if (letter.toLowerCase() === targetWord[index]) {
                        // Correct position
                        bgColor = "bg-success-500";
                        textColor = "text-white";
                        borderColor = "border-success-500";
                    } else if (targetWord.includes(letter.toLowerCase())) {
                        // Correct letter, wrong position
                        bgColor = "bg-warning-500";
                        textColor = "text-black";
                        borderColor = "border-warning-500";
                    } else {
                        // Wrong letter
                        bgColor = "bg-default-300";
                        textColor = "text-foreground";
                        borderColor = "border-default-300";
                    }
                }

                return (
                    <div
                        key={index}
                        className={`flex aspect-square w-full items-center justify-center border-2 text-2xl font-bold uppercase ${borderColor} ${bgColor} ${textColor} rounded-md transition-all duration-300`}
                    >
                        {letter.trim()}
                    </div>
                );
            })}
        </div>
    );
};
