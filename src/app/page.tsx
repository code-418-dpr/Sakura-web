"use client";

import NavbarElement from "@/components/Navbar/navbar";
import { Image } from "@heroui/react";

export default function Home() {
    return (
        <div>
            <section>
                <NavbarElement />
            </section>
            <div className="flex min-h-screen items-start justify-between px-8 py-16">
                {/* Левая ветка */}
                <Image alt="HeroUI hero Image" src="sakura.webp" className="w-[90%]" />

                {/* Центр с логотипом и подписями */}
                <div className="mb-10 flex flex-col items-center justify-end">
                    <Image alt="Sakura Logo" src="sakura.png" className="mb-4 h-auto w-auto" />
                    <h1 className="text-6xl font-bold">SAKURA</h1>
                    <p className="text-lg text-gray-500">prod. Код 418</p>
                </div>

                {/* Правая ветка (отражённая) */}
                <Image
                    alt="HeroUI mirrored hero Image"
                    src="sakura.webp"
                    className="ml-auto w-[90%] scale-x-[-1] self-end"
                />
            </div>
        </div>
    );
}
