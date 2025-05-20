"use client";

import React from "react";

import { GameBoard } from "./components/game-board";
import { GameHeader } from "./components/game-header";
import { GameRules } from "./components/game-rules";
import { GameProvider } from "./context/game-context";

export default function NavalBattle2() {
    return (
        <div className="bg-background text-foreground min-h-screen p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
                <GameProvider>
                    <GameHeader />
                    <GameBoard />
                    <GameRules />
                </GameProvider>
            </div>
        </div>
    );
}
