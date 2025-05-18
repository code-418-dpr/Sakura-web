"use client";

import { motion } from "framer-motion";

import FooterElement from "@/components/Footer/footer";
import NavbarElement from "@/components/Navbar/navbar";
import { Image } from "@heroui/react";

export default function Home() {
    return (
        <div>
            <NavbarElement />
            <div className="flex min-h-screen flex-col items-center justify-between gap-8 px-4 py-16 md:flex-row md:items-start md:px-8">
                {/* Левая ветка с анимацией */}
                <motion.div
                    className="flex w-full justify-center md:w-[30%]"
                    animate={{ y: [0, -10, 0, 10, 0], rotate: [0, -1, 0, 1, 0] }}
                    transition={{
                        repeat: Infinity,
                        duration: 6,
                        ease: "easeInOut",
                    }}
                >
                    <Image alt="HeroUI hero Image" src="sakura.webp" className="w-full max-w-xs md:max-w-full" />
                </motion.div>

                {/* Центр с логотипом и подписями */}
                <div className="flex w-full flex-col items-center text-center md:w-[40%]">
                    <Image alt="Sakura Logo" src="sakura.png" className="mb-4 h-auto w-32 md:w-40 lg:w-48" />
                    <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">SAKURA</h1>
                    <p className="text-base text-gray-500 md:text-lg">prod. Код 418</p>
                </div>

                {/* Правая ветка с отражённой анимацией */}
                <motion.div
                    className="flex w-full justify-center md:w-[30%] md:justify-end"
                    animate={{ y: [0, 10, 0, -10, 0], rotate: [0, 1, 0, -1, 0] }}
                    transition={{
                        repeat: Infinity,
                        duration: 6,
                        ease: "easeInOut",
                    }}
                >
                    <Image
                        alt="HeroUI mirrored hero Image"
                        src="sakura.webp"
                        className="w-full max-w-xs scale-x-[-1] md:max-w-full"
                    />
                </motion.div>
            </div>
            <FooterElement />
        </div>
    );
}
