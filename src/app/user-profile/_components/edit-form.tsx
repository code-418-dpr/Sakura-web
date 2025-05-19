import React, { useState } from "react";

import { useRouter } from "next/navigation";

// import { AuthContext } from "@/contexts/auth/AuthContext";
import { UpdateProfileProps } from "@/lib/update-profile-props";
// import { refresh, updateProfile } from "@/api/accounts";
import { PersonalInfoProps } from "@/lib/user-personal-info-props";
import { Button, Input } from "@heroui/react";

export function EditProfileForm({ user }: PersonalInfoProps) {
    const router = useRouter();
    // const updateUserData = useContext(AuthContext)!.updateUserData;
    const [formData, setFormData] = useState({
        firstName: user.firstName || undefined,
        lastname: user.lastname || undefined,
        patronymic: user.patronymic ?? undefined,
        phone: user.phone || undefined,
        email: user.email || undefined,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            console.log(formData);

            const data: UpdateProfileProps = {
                firstName: formData.firstName,
                lastname: formData.lastname,
                patronymic: formData.patronymic,
                phone: formData.phone,
                email: formData.email,
            };

            console.log(data);

            await new Promise((resolve) => setTimeout(resolve, 500));
            /*
            const responseUpdateProfile = await updateProfile(data);
            if (responseUpdateProfile.status === 200) {
                const response = await refresh();
                updateUserData(response.data.result!);
            }*/
            router.refresh();
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    return (
        <>
            <Input
                name="firstName"
                label="Имя"
                type="text"
                variant="bordered"
                value={formData.firstName}
                onChange={handleInputChange}
            />
            <Input
                name="secondName"
                label="Фамилия"
                type="text"
                variant="bordered"
                value={formData.lastname}
                onChange={handleInputChange}
            />
            <Input
                name="patronymic"
                label="Отчество"
                type="text"
                variant="bordered"
                value={formData.patronymic}
                onChange={handleInputChange}
            />
            <Input
                name="email"
                label="Почта"
                type="email"
                variant="bordered"
                value={formData.email}
                onChange={handleInputChange}
            />
            <Input
                name="phone"
                label="Номер телефона"
                type="text"
                variant="bordered"
                value={formData.phone}
                onChange={handleInputChange}
            />
            <Button
                color="primary"
                onPress={() => {
                    void handleSubmit();
                }}
            >
                Сохранить
            </Button>
        </>
    );
}
