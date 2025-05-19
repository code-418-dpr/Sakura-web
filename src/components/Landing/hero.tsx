// src/components/Landing/hero.tsx
"use client";

import { motion } from "framer-motion";

import React from "react";

import Image from "next/image";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

import { heroData } from "../../mocks/hero-data";

// src/components/Landing/hero.tsx

// src/components/Landing/hero.tsx

const Hero: React.FC = () => {
    return (
        <section className="relative overflow-hidden py-20">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { duration: 2, ease: "easeInOut" },
                    },
                }}
                className="pointer-events-none absolute inset-0 z-[-1]"
            >
                {/* плавный градиент: α 0.1 → 0.3 → 0.1 */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to bottom, rgba(120,40,200,0) 0%, rgba(120,40,200,0.3) 50%, rgba(120,40,200,0) 100%)",
                    }}
                />
            </motion.div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
                    <motion.div
                        className="text-center md:w-1/2 md:text-left"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h1 className="from-primary-500 via-primary-400 to-secondary-500 mb-6 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent md:text-5xl lg:text-6xl">
                            {heroData.title}
                        </h1>
                        <p className="text-foreground-600 mb-8 text-lg md:text-xl">{heroData.description}</p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                            <Button
                                color="primary"
                                size="lg"
                                radius="full"
                                className="font-semibold"
                                startContent={<Icon icon="lucide:ticket" />}
                            >
                                {heroData.primaryButtonText}
                            </Button>
                            <Button
                                variant="bordered"
                                color="primary"
                                size="lg"
                                radius="full"
                                className="font-semibold"
                                startContent={<Icon icon="lucide:info" />}
                            >
                                {heroData.secondaryButtonText}
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex justify-center md:w-1/2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.5,
                            type: "spring",
                            stiffness: 100,
                        }}
                    >
                        <div className="relative">
                            <motion.div
                                animate={{
                                    y: [0, -15, 0],
                                    rotate: [0, -2, 0, 2, 0],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 6,
                                    ease: "easeInOut",
                                }}
                                className="relative z-10"
                            >
                                <Image
                                    src={heroData.imageUrl}
                                    alt={heroData.imageAlt}
                                    width={600}
                                    height={600}
                                    unoptimized
                                    className="relative top-[-20px] h-auto max-w-full rounded-2xl shadow-xl"
                                />
                            </motion.div>

                            <motion.div
                                className="absolute right-0 -bottom-6 left-0 mx-auto h-12 w-4/5 rounded-full bg-black/20 blur-xl"
                                animate={{
                                    scaleX: [1, 1.1, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 6,
                                    ease: "easeInOut",
                                }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
