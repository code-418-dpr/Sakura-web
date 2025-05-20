"use client";

import { motion } from "framer-motion";

import React from "react";

import { LuckyPathGame } from "./components/lucky-path-game";

export default function App() {
    return (
        <div className="bg-game-background text-game-foreground min-h-screen">
            <motion.div
                className="container mx-auto px-4 py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <header className="mb-8 text-center">
                    <motion.h1
                        className="from-game-accent mb-2 bg-gradient-to-r to-yellow-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Lucky Path
                    </motion.h1>
                    <p className="mx-auto max-w-md text-slate-400">
                        Navigate the tree to find the hidden path to riches. Choose wisely!
                    </p>
                </header>

                <LuckyPathGame />
            </motion.div>
        </div>
    );
}
