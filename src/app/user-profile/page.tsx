"use client";

import React from "react";

import { EditProfileForm } from "@/app/user-profile/_components/edit-form";
// import { EditProfileModal } from "@/app/profile/Components/PersonalInfo/editProfileModal";
import { ProfileTabs } from "@/app/user-profile/_components/profile-tabs";
import ModalOrDrawer from "@/components/modal-or-drawer";
import { User } from "@/types/user";
// import { ProfileSkeleton } from "@/app/user-profile/_components/skeleton";
// import { AuthContext } from "@/hooks/use-auth";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar, Button, useDisclosure } from "@heroui/react";

export default function UserProfilePage() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // const { user } = useContext(AuthContext)!;
    const user: User = {
        id: "1",
        userName: "Trojan",
        email: "test@gmail.com",
        phone: "+79493199313",
        firstName: "Вадим",
        lastname: "Якубенко",
        patronymic: "Виталиевич",
        isVip: true,
    };
    /*
    const [isLoading, setIsLoading] = useState(true);

    console.log(user);


    useEffect(() => {
        if (user) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 500);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [user]);

    if (isLoading || !user) {
        return <ProfileSkeleton />;
    }
     */

    return (
        <div className="container mx-auto py-6">
            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                <div className="flex flex-col items-center">
                    <Card>
                        <CardBody className="flex flex-col items-center space-y-4 p-6">
                            <Avatar
                                className="text-large h-32 w-32"
                                src="https://ds4-sosnovoborsk-r04.gosweb.gosuslugi.ru/netcat_files/21/10/blankdirectory_3.png"
                            />
                            <div className="pt-2 text-center">
                                {user.patronymic === undefined ? (
                                    <h2 className="text-xl font-bold">{user.lastname + " " + user.firstName}</h2>
                                ) : (
                                    <h2 className="text-xl font-bold">
                                        {user.lastname + " " + user.firstName + " " + user.patronymic!}
                                    </h2>
                                )}
                                <p className="text-muted-foreground pt-2 text-sm">@{user.userName}</p>
                                {user.isVip && (
                                    <Chip className="mt-2" color="warning">
                                        VIP статус
                                    </Chip>
                                )}
                            </div>
                            <Button color="primary" onPress={onOpen} variant="solid" className="h-[30px]" radius={"sm"}>
                                Редактировать
                            </Button>
                            <ModalOrDrawer label="Редактировать" isOpen={isOpen} onOpenChangeAction={onOpenChange}>
                                <EditProfileForm user={user} />
                            </ModalOrDrawer>
                        </CardBody>
                    </Card>
                </div>
                <div className="flex flex-col">
                    <div className="space-y-2 pl-3">
                        <h1 className="text-3xl font-bold tracking-tight">Профиль пользователя</h1>
                    </div>
                    <div className="max-w-full">
                        <ProfileTabs user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
}
