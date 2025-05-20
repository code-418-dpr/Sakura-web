"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import ModalOrDrawer from "@/components/modal-or-drawer";
import { updateUser } from "@/data/user";
import { useAuth } from "@/hooks/use-auth";
import { Game } from "@/types/game";
import { Badge, Button, Card, CardBody, Image, addToast, useDisclosure } from "@heroui/react";

interface Props {
    paginatedData: Game[];
}

export default function GamesCards({ paginatedData }: Props) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const router = useRouter();
    const { user } = useAuth();

    return (
        <>
            {paginatedData.map((e) => {
                return (
                    <div
                        key={e.id}
                        onClick={() => {
                            if (e.isForVip && user?.isVip) {
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
            <div key="7" onClick={onOpen}>
                <Card className="min-h-[430px] cursor-pointer transition-shadow hover:shadow-lg">
                    <CardBody className="space-y-4">
                        <Image
                            alt="Русская рулетка призов"
                            src="https://avatars.mds.yandex.net/i?id=fb1c1cf29ca8f31b0d0fb2a1b35e1944_l-12473832-images-thumbs&n=13"
                            className="w-full rounded-xl object-cover"
                        />
                        <div className="space-y-2">
                            <h3 className="text-center text-2xl font-bold">Русская рулетка призов</h3>
                            <div className="flex items-center pt-2">
                                <p>Загрузите патроны в револьвер и сделайте выстрел, который может принести Вам приз</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <ModalOrDrawer label="Подтверждение" isOpen={isOpen} onOpenChangeAction={onOpenChange}>
                    <AcceptGame />
                </ModalOrDrawer>
            </div>
        </>
    );
}

function AcceptGame() {
    const [isLoading, setIsLoading] = useState(false);
    const { user, update } = useAuth();
    const router = useRouter();

    const handleAccept = async () => {
        try {
            setIsLoading(true);
            if (!user) return null;

            await updateUser(user.id, Number(user.realBalance) - 100, Number(user.virtualBalance));

            await update();

            router.push("/games/revolver");
        } catch (error: unknown) {
            // Явно указываем тип unknown
            console.log(error);
            let errorMessage = "Произошла неизвестная ошибка";

            if (error instanceof Error) {
                // Проверяем, является ли ошибка экземпляром Error
                errorMessage = error.message;
            }

            addToast({
                title: "Ошибка",
                description: errorMessage, // Используем безопасное сообщение
                color: "danger",
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePress = () => {
        void handleAccept(); // Явно указываем, что игнорируем Promise
    };

    return (
        <>
            <p>Вы уверены что хотите сыграть в игру за 100 руб.?</p>
            <Button
                type="submit"
                color="success"
                isLoading={isLoading}
                fullWidth
                className="mt-6"
                onPress={handlePress}
            >
                Подтвердить
            </Button>
        </>
    );
}
