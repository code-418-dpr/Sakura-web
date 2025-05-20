import React, { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";

interface ConfettiProps {
    active: boolean;
    duration?: number;
    colors?: string[];
}

const Confetti: React.FC<ConfettiProps> = ({
    active,
    duration = 3000,
    colors = ["#FFB7D5", "#FFD7E5", "#9353d3", "#7828c8", "#5271ff"],
}) => {
    const [isActive, setIsActive] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (active) {
            setIsActive(true);
            const timer = setTimeout(() => {
                setIsActive(false);
            }, duration);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [active, duration]);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (!isActive) return null;

    return (
        <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.15}
            colors={colors}
            confettiSource={{
                x: windowSize.width / 2,
                y: windowSize.height / 3,
                w: 0,
                h: 0,
            }}
        />
    );
};

export default Confetti;
