import React, { useEffect, useRef } from "react";

const BackgroundPetals: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const petalCount = 20;

        // Remove any existing petals
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Create new petals
        for (let i = 0; i < petalCount; i++) {
            createPetal(container);
        }

        // Create petals at intervals
        const interval = setInterval(() => {
            if (document.body.contains(container)) {
                createPetal(container);
            } else {
                clearInterval(interval);
            }
        }, 3000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const createPetal = (container: HTMLDivElement) => {
        const petal = document.createElement('div');
        const petalInner = document.createElement('div');

        // Random properties
        const size = Math.random() * 20 + 10;       // 10–30px
        const randomX = Math.random() * 100;        // 0–100%
        const randomRotation = Math.random() * 360; // 0–360deg
        const randomDuration = Math.random() * 5 + 10; // 10–15s
        const randomDelay = Math.random() * 5;      // 0–5s

        // Apply styles
        petal.className = 'petal';
        petalInner.className = 'petal-inner';

        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${randomX}%`;
        petal.style.top = '-50px';
        petal.style.transform = `rotate(${randomRotation}deg)`;
        petal.style.animationDuration = `${randomDuration}s`;
        petal.style.animationDelay = `${randomDelay}s`;
        // вот здесь приводим к строке правильно:
        petal.style.setProperty('--random-x', String(Math.random() * 2 - 1));

        // Append to DOM
        petal.appendChild(petalInner);
        container.appendChild(petal);

        // Remove after animation completes
        setTimeout(() => {
            if (petal.parentNode === container) {
                container.removeChild(petal);
            }
        }, (randomDuration + randomDelay) * 1000);
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
            aria-hidden="true"
        />
    );
};

export default BackgroundPetals;
