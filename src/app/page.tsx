"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image } from "@heroui/react";
import NavbarElement from "@/components/Navbar/navbar";
import FooterElement from "@/components/Footer/footer";
import BackgroundPetals from "@/components/Landing/background-petals";
import Hero from "@/components/Landing/hero";
import WinnersSection from "@/components/Landing/winners-section";
import TestimonialsSection from "@/components/Landing/testimonials-section";
import FaqSection from "@/components/Landing/faq-section";
import { Tab } from "@/types/tabs";
import { SectionScrollSnap } from "@/components/Landing/section-scroll-snap";

export default function App() {
    const [activeTab, setActiveTab] = useState<Tab>("main");
    const [showNavbar, setShowNavbar] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // показываем Navbar, когда проскролили ниже первого экрана
            setShowNavbar(window.scrollY > window.innerHeight / 1.2);
        };
        // проверить сразу на случай reload внизу страницы
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => { window.removeEventListener("scroll", handleScroll); };
    }, []);

    return (
        <div className="relative">
            {/* Фоновые лепестки всегда */}
            <BackgroundPetals />

            {/* Navbar: прячем на первом экране, показываем ниже */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={showNavbar ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="fixed top-0 left-0 w-full z-50"
            >
                <NavbarElement
                    activeTab={activeTab}
                    setActiveTabAction={setActiveTab}
                />
            </motion.div>

            {/* Banner */}
            <SectionScrollSnap
                id="banner"
                className="min-h-screen flex items-center justify-center transform -translate-y-[20px]"
            >
                <div className="container mx-auto">
                    <div className="flex flex-col items-center justify-between gap-8 px-4 py-16 md:flex-row md:items-center">
                        <motion.div
                            className="flex w-full justify-center md:w-[30%]"
                            animate={{ y: [0, -10, 0, 10, 0], rotate: [0, -1, 0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        >
                            <Image
                                alt="HeroUI hero Image"
                                src="sakura.webp"
                                className="w-full max-w-xs md:max-w-full"
                            />
                        </motion.div>
                        <div className="flex w-full flex-col items-center text-center md:w-[40%]">
                            <Image
                                alt="Sakura Logo"
                                src="sakura.png"
                                className="mb-4 h-auto w-32 md:w-40 lg:w-48"
                            />
                            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500 bg-clip-text text-transparent">
                                SAKURA
                            </h1>
                            <p className="text-base text-gray-500 md:text-lg">
                                Больше, чем просто лото
                            </p>
                        </div>
                        <motion.div
                            className="flex w-full justify-center md:w-[30%] md:justify-end"
                            animate={{ y: [0, 10, 0, -10, 0], rotate: [0, 1, 0, -1, 0] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        >
                            <Image
                                alt="HeroUI mirrored hero Image"
                                src="sakura.webp"
                                className="w-full max-w-xs scale-x-[-1] md:max-w-full"
                            />
                        </motion.div>
                    </div>
                </div>
            </SectionScrollSnap>

            {/* Остальные секции */}
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
