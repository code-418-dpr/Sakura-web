import React, { useState } from "react";

// import { AuthContext } from "@/contexts/auth/AuthContext";
import { UpdateProfileProps } from "@/lib/update-profile-props";
// import { refresh, updateProfile } from "@/api/accounts";
import { PersonalInfoProps } from "@/lib/user-personal-info-props";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";

export function EditProfileModal({ user }: PersonalInfoProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // const updateUserData = useContext(AuthContext)!.updateUserData;
    const [formData, setFormData] = useState({
        firstName: user.firstName || undefined,
        lastname: user.lastname || undefined,
        patronymic: user.patronymic ?? undefined,
        phone: user.phone || undefined,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (onClose: () => void) => {
        try {
            console.log(formData);

            const data: UpdateProfileProps = {
                firstName: formData.firstName,
                lastname: formData.lastname,
                patronymic: formData.patronymic,
                phone: formData.phone,
            };

            console.log(data);

            await new Promise((resolve) => setTimeout(resolve, 500));
            /*
            const responseUpdateProfile = await updateProfile(data);
            if (responseUpdateProfile.status === 200) {
                const response = await refresh();
                updateUserData(response.data.result!);
            }*/
            onClose();
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    return (
        <>
            <Button color="primary" onPress={onOpen} variant="solid" className="h-[30px]" radius={"sm"}>
                Редактировать
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Редактирование</ModalHeader>
                            <ModalBody>
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
                                    name="phone"
                                    label="Номер телефона"
                                    type="text"
                                    variant="bordered"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Закрыть
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() => {
                                        void handleSubmit(onClose);
                                    }}
                                >
                                    Сохранить
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
