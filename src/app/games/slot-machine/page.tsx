"use client";

import React from "react";

import dynamic from "next/dynamic";

// Динамически импортируем слот-машину, чтобы избежать SSR ошибок
const SlotMachine = dynamic(() => import("@/app/games/slot-machine/SlotMachine"), {
    ssr: false,
    loading: () => <p className="text-foreground/70 mt-10 text-center">Loading slot machine...</p>,
});

const MiniFortunePage: React.FC = () => {
    return <SlotMachine />;
};

export default MiniFortunePage;
