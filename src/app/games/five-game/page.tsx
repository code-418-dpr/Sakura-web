"use client";

import React from "react";

import { WordGame } from "@/components/five-game/word-game";

export default function FiveGamePage() {
    return (
        <div className="container mx-auto justify-items-center py-6">
            <WordGame />
        </div>
    );
}
