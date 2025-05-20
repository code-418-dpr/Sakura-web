"use client";

import { useRouter } from "next/navigation";

import { Game } from "@/types/game";
import { Badge, Card, CardBody, Image, addToast } from "@heroui/react";

// import {useAuth} from "@/hooks/use-auth";

interface Props {
    paginatedData: Game[];
}

export default function GamesCards({ paginatedData }: Props) {
    const router = useRouter();
    // const {user} = useAuth();

    return (
        <>
            {paginatedData.map((e) => {
                return (
                    <div
                        key={e.id}
                        onClick={() => {
                            if (e.isForVip) {
                                addToast({
                                    title: "Отказ в доступе",
                                    description: "Для доступа к этой игре приобретите VIP статус",
                                    color: "danger",
                                    timeout: 3000,
                                    shouldShowTimeoutProgress: true,
                                });
                                return;
                            }
                            router.push(`/games/${e.pageUrl}`);
                        }}
                    >
                        <Card className="min-h-[430px] cursor-pointer transition-shadow hover:shadow-lg">
                            <CardBody className="space-y-4">
                                <Badge
                                    color="warning"
                                    content="VIP"
                                    key={`badge-${e.id}`}
                                    isInvisible={!e.isForVip}
                                    className="p-1.5"
                                    size="lg"
                                >
                                    <Image alt={e.title} src={e.imageUrl} className="w-full rounded-xl object-cover" />
                                </Badge>
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
