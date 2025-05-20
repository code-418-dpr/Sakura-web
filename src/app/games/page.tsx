"use client";

import React from "react";

import GamesCards from "@/app/games/_components/games-cards";
import { games } from "@/mocks/games";

export default function GamesPage() {
    return (
        <div className="container mx-auto w-full flex-1 px-1 py-8">
            <div className="grid min-h-[80vh] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <GamesCards paginatedData={games} />
            </div>
        </div>
    );
}
