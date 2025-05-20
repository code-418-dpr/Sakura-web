"use client";

import React from "react";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

import { GameProvider } from "./components/game-context";
import { GameHeader } from "./components/game-header";
import { GameInterface } from "./components/game-interface";

export default function DiceRoll() {
    return (
        <div className="from-content1 to-content2 flex min-h-screen items-center justify-center p-4">
            <GameProvider>
                <Card className="w-full max-w-3xl shadow-lg">
                    <CardHeader className="flex flex-col gap-2">
                        <GameHeader />
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <GameInterface />
                    </CardBody>
                </Card>
            </GameProvider>
        </div>
    );
}
