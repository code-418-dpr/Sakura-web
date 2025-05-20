// src/app/page.tsx
"use client";

import { motion } from "framer-motion";

import React, { useState } from "react";

import FooterElement from "@/components/Footer/footer";
import BackgroundPetals from "@/components/Landing/background-petals";
import FaqSection from "@/components/Landing/faq-section";
import Hero from "@/components/Landing/hero";
import { SectionScrollSnap } from "@/components/Landing/section-scroll-snap";
import TestimonialsSection from "@/components/Landing/testimonials-section";
import WinnersSection from "@/components/Landing/winners-section";
import NavbarElement from "@/components/Navbar/navbar";
import { PageTab } from "@/types/tabs";
import { Image } from "@heroui/react";

// src/app/page.tsx

// src/app/page.tsx

// src/app/page.tsx

// src/app/page.tsx

// src/app/page.tsx

export default function Home() {
    const [activeTab, setActiveTab] = useState<PageTab>("main");
    const [showNavbar] = useState(true);

    return (
        <div className="relative">
            {/* Фоновые лепестки */}
            <BackgroundPetals />

            {/* Navbar: скрыт на первом экране, показывается при скролле */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={showNavbar ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="fixed top-0 left-0 z-50 w-full"
            >
                <NavbarElement activeTab={activeTab} setActiveTabAction={setActiveTab} />
            </motion.div>

            {/* Баннер */}
            <SectionScrollSnap
                id="banner"
                className="flex min-h-screen -translate-y-[20px] transform items-center justify-center"
            >
                <div className="container mx-auto">
                    <div className="flex flex-col items-center justify-between gap-8 px-4 py-16 md:flex-row md:items-center">
                        <motion.div
                            className="flex w-full justify-center md:w-[30%]"
                            animate={{
                                y: [0, -10, 0, 10, 0],
                                rotate: [0, -1, 0, 1, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 6,
                                ease: "easeInOut",
                            }}
                        >
                            <Image alt="Hero Image" src="sakura.webp" className="w-full max-w-xs md:max-w-full" />
                        </motion.div>

                        <div className="flex w-full flex-col items-center text-center md:w-[40%]">
                            <Image alt="Sakura Logo" src="sakura.png" className="mb-4 h-auto w-32 md:w-40 lg:w-48" />
                            <h1 className="from-primary-500 via-primary-400 to-secondary-500 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent md:text-5xl lg:text-6xl">
                                SAKURA
                            </h1>
                            <p className="text-base text-gray-500 md:text-lg">Больше, чем просто лото</p>
                        </div>

                        <motion.div
                            className="flex w-full justify-center md:w-[30%] md:justify-end"
                            animate={{
                                y: [0, 10, 0, -10, 0],
                                rotate: [0, 1, 0, -1, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 6,
                                ease: "easeInOut",
                            }}
                        >
                            <Image
                                alt="Mirrored Hero Image"
                                src="sakura.webp"
                                className="w-full max-w-xs scale-x-[-1] md:max-w-full"
                            />
                        </motion.div>
                    </div>
                </div>
            </SectionScrollSnap>

            {/* Секции лендинга */}
            <SectionScrollSnap id="hero">
                <Hero />
            </SectionScrollSnap>

            <SectionScrollSnap id="winners">
                <WinnersSection />
            </SectionScrollSnap>

            <SectionScrollSnap id="testimonials">
                <TestimonialsSection />
            </SectionScrollSnap>

            <SectionScrollSnap id="faq">
                <FaqSection />
            </SectionScrollSnap>

            {/* Footer */}
            <FooterElement />
        </div>
    );
}
