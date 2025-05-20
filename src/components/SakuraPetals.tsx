import { motion } from "framer-motion";

import React, { useEffect, useState } from "react";

interface Petal {
    id: number;
    x: number;
    y: number;
    size: number;
    rotation: number;
    duration: number;
    delay: number;
    type: number;
}

const SakuraPetals: React.FC = () => {
    const [petals, setPetals] = useState<Petal[]>([]);

    useEffect(() => {
        const createPetals = () => {
            const newPetals: Petal[] = [];
            const count = Math.floor(window.innerWidth / 50); // Adjust petal count based on screen width

            for (let i = 0; i < count; i++) {
                newPetals.push({
                    id: i,
                    x: Math.random() * window.innerWidth,
                    y: -50 - Math.random() * 100, // Start above the viewport
                    size: 20 + Math.random() * 20,
                    rotation: Math.random() * 360,
                    duration: 10 + Math.random() * 20,
                    delay: Math.random() * 20,
                    type: Math.floor(Math.random() * 3) + 1,
                });
            }

            setPetals(newPetals);
        };

        createPetals();

        const handleResize = () => {
            createPetals();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            {petals.map((petal) => (
                <motion.div
                    key={petal.id}
                    className={`petal petal-${petal.type}`}
                    style={{
                        width: petal.size,
                        height: petal.size,
                        left: petal.x,
                        top: petal.y,
                        rotate: petal.rotation,
                    }}
                    animate={{
                        y: window.innerHeight + 100,
                        x: petal.x + (Math.random() * 200 - 100),
                        rotate: petal.rotation + (Math.random() > 0.5 ? 360 : -360),
                    }}
                    transition={{
                        duration: petal.duration,
                        delay: petal.delay,
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "loop",
                    }}
                />
            ))}
        </div>
    );
};

export default SakuraPetals;
