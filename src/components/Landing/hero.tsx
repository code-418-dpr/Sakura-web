"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { heroData } from "../../mocks/hero-data";

const Hero: React.FC = () => {
    return (
        <section className="relative py-20 overflow-hidden">
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
                className="absolute inset-0 pointer-events-none z-[-1]"
            >
                {/* плавный градиент: α 0 → 0.3 → 0 */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to bottom, rgba(120,40,200,0) 0%, rgba(120,40,200,0.3) 50%, rgba(120,40,200,0) 100%)",
                    }}
                />
            </motion.div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <motion.div
                        className="md:w-1/2 text-center md:text-left"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500 bg-clip-text text-transparent">
                            {heroData.title}
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-foreground-600">
                            {heroData.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
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
                        className="md:w-1/2 flex justify-center"
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
                                    className="relative top-[-20px] max-w-full h-auto rounded-2xl shadow-xl"
                                />
                            </motion.div>

                            <motion.div
                                className="absolute -bottom-6 left-0 right-0 mx-auto w-4/5 h-12 bg-black/20 rounded-full blur-xl"
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
