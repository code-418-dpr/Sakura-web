import { AnimatePresence, motion, useInView } from "framer-motion";

import React, { useEffect, useRef, useState } from "react";

import { Avatar, Badge, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

import { winners } from "../../mocks/winners-data";

const DISPLAY_COUNT = 4;
const AUTO_SCROLL_INTERVAL = 5000;

// Container animation variants
const containerVariants = {
    animate: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

// Card animation variants for the continuous flow effect
const cardVariants = {
    // Cards entering from right
    enter: (i: number) => ({
        x: "100%",
        opacity: 0,
        transition: {
            type: "spring",
            stiffness: 50,
            damping: 20,
            delay: i * 0.05,
        },
    }),
    // Cards in view
    center: (i: number) => ({
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 12,
            delay: i * 0.05,
        },
    }),
    // Cards exiting to left with bounce effect
    exit: (i: number) => ({
        x: "-120%",
        opacity: 0,
        transition: {
            type: "spring",
            stiffness: 50,
            damping: 20,
            delay: i * 0.05,
        },
    }),
};

const WinnersSection: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, amount: 0.2 });
    const [start, setStart] = useState(0);
    const [key, setKey] = useState(0); // Key to force re-render of AnimatePresence

    // Auto-scroll with continuous animation
    useEffect(() => {
        const id = setInterval(() => {
            setStart((prev) => (prev + DISPLAY_COUNT) % winners.length);
            setKey((prev) => prev + 1); // Update key to force re-render
        }, AUTO_SCROLL_INTERVAL);
        return () => {
            clearInterval(id);
        };
    }, []);

    // Current page of winners
    const page = Array.from({ length: DISPLAY_COUNT }, (_, i) => winners[(start + i) % winners.length]);

    return (
        <section className="from-background via-background to-content1/30 bg-gradient-to-b py-22" ref={ref}>
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3 }}
                    className="mb-12 text-center"
                >
                    <h2 className="from-primary-500 via-primary-400 to-secondary-500 mb-4 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                        Недавние победители
                    </h2>
                    <p className="text-foreground-500 mx-auto max-w-2xl">
                        Присоединяйтесь к нашему растущему списку победителей — ваше имя может быть следующим!
                    </p>
                </motion.div>

                {/* Carousel */}
                <div className="relative mb-12 overflow-hidden">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={key}
                            variants={containerVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                        >
                            {page.map((winner, index) => (
                                <motion.div
                                    key={`${key}-${winner.id}`}
                                    custom={index}
                                    variants={cardVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="h-full"
                                >
                                    <Card className="border-divider h-full overflow-hidden border" isHoverable>
                                        <CardBody className="from-content1 to-content2 relative h-full bg-gradient-to-br p-5">
                                            <div className="mb-4 flex items-center gap-4">
                                                <motion.div
                                                    initial={{ scale: 0.8 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 260,
                                                        damping: 20,
                                                        delay: 0.1 + index * 0.05,
                                                    }}
                                                >
                                                    <Avatar
                                                        src={winner.avatar}
                                                        size="lg"
                                                        isBordered
                                                        color="primary"
                                                        className="shimmer"
                                                    />
                                                </motion.div>
                                                <div>
                                                    <h3 className="font-semibold">{winner.name}</h3>
                                                    <p className="text-foreground-500 text-sm">{winner.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-foreground-500 text-sm">Билет</p>
                                                    <p className="font-medium">{winner.ticket}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-foreground-500 text-sm">Приз</p>
                                                    <p className="from-primary-500 to-secondary-500 bg-gradient-to-r bg-clip-text font-bold text-transparent">
                                                        {winner.prize}
                                                    </p>
                                                </div>
                                            </div>
                                            <motion.div
                                                className="absolute top-3 right-3"
                                                initial={{ rotate: -20, scale: 0 }}
                                                animate={{ rotate: 0, scale: 1 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 260,
                                                    damping: 20,
                                                    delay: 0.2 + index * 0.05,
                                                }}
                                            >
                                                <Icon icon="lucide:trophy" className="text-primary-400 text-xl" />
                                            </motion.div>
                                        </CardBody>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-center"
                >
                    <p className="text-foreground-500 mb-4">Хотите увидеть больше победителей?</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                        <Badge color="primary" variant="flat" size="lg">
                            Просмотреть всех победителей
                        </Badge>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default WinnersSection;
