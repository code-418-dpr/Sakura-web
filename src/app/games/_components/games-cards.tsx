"use client";

import { useRouter } from "next/navigation";

import { Game } from "@/types/game";
import { Card, CardBody, Image } from "@heroui/react";

interface Props {
    paginatedData: Game[];
}

export default function GamesCards({ paginatedData }: Props) {
    const router = useRouter();

    return (
        <>
            {paginatedData.map((e) => {
                return (
                    <div
                        key={e.id}
                        onClick={() => {
                            router.push(`/games/${e.pageUrl}`);
                        }}
                    >
                        <Card className="min-h-[430px] cursor-pointer transition-shadow hover:shadow-lg">
                            <CardBody className="space-y-4">
                                <Image alt={e.title} src={e.imageUrl} className="w-full rounded-xl object-cover" />
                                <div className="space-y-2">
                                    <h3 className="text-center text-2xl font-bold">{e.title}</h3>
                                    <div className="flex items-center pt-2">
                                        <p>{e.description}</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                );
            })}
        </>
    );
}
