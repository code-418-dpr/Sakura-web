"use client";

import { z } from "zod";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// import { register } from "@/api/accounts";
import PasswordInput from "@/components/password-input";
import { createUser, getUserById } from "@/data/user";
// import { RegisterProps } from "@/models/requests/RegisterProps";
import { baseRegistrationSchema } from "@/schemas/base-registration-schema";
import { Alert, Button, Checkbox, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = baseRegistrationSchema
    .extend({
        password: z
            .string()
            .min(8, "Пароль должен содержать минимум 8 символов")
            .regex(/[A-ZА-ЯЁ]/, "Пароль должен содержать хотя бы одну заглавную букву")
            .regex(/[a-zа-яё]/, "Пароль должен содержать хотя бы одну строчную букву")
            .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
        passwordRepeat: z.string(),
        privacyPolicy: z.literal<boolean>(true, {
            errorMap: () => ({ message: "Необходимо принять условия" }),
        }),
        termsOfUse: z.literal<boolean>(true, {
            errorMap: () => ({ message: "Необходимо принять условия" }),
        }),
        referal: z.string().nullish(),
    })
    .refine((data) => data.password === data.passwordRepeat, {
        message: "Пароли не совпадают",
        path: ["passwordRepeat"],
    });

export default function UserForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [, setMessageType] = useState<"success" | "error" | null>(null);
    const router = useRouter();
    const {
        register: registerValidator,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            // Добавляем начальные значения
            privacyPolicy: false,
            termsOfUse: false,
        },
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<z.infer<typeof userSchema>> = async (data) => {
        try {
            setIsLoading(true);
            setMessage(null);
            setMessageType(null);

            console.log(data);

            await new Promise((resolve) => setTimeout(resolve, 500));

            if (data.referal) {
                const user = await getUserById(data.referal);
                if (!user) throw new Error("Реферальная ссылка не найдена");
            }

            await createUser(data.nickname, data.email, data.password);
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (result?.error) {
                throw new Error(result.error);
            }
            router.push("/");
            router.refresh();
        } catch (error) {
            console.log(error);
            setMessage("Не получилось");
            setMessageType("error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e).catch(console.error);
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="flex flex-col gap-4">
                <Input
                    label="Email"
                    type="email"
                    variant="bordered"
                    {...registerValidator("email")}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                />
                <Input
                    label="Никнейм"
                    type="text"
                    variant="bordered"
                    {...registerValidator("nickname")}
                    isInvalid={!!errors.nickname}
                    errorMessage={errors.nickname?.message}
                />
                <PasswordInput
                    {...registerValidator("password")}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                />
                <PasswordInput
                    label="Повторите пароль"
                    {...registerValidator("passwordRepeat")}
                    isInvalid={!!errors.passwordRepeat}
                    errorMessage={errors.passwordRepeat?.message}
                />

                <Input
                    label="Реферальный код"
                    type="text"
                    variant="bordered"
                    {...registerValidator("referal")}
                    isInvalid={!!errors.referal}
                    errorMessage={errors.referal?.message}
                />

                <Checkbox {...registerValidator("privacyPolicy")} isInvalid={!!errors.privacyPolicy}>
                    Согласен с обработкой персональных данных
                </Checkbox>
                {errors.privacyPolicy && <p className="text-danger text-sm">{errors.privacyPolicy.message}</p>}

                <Checkbox {...registerValidator("termsOfUse")} isInvalid={!!errors.termsOfUse}>
                    Согласен с условиями платформы и законодательством РФ
                </Checkbox>
                {errors.termsOfUse && <p className="text-danger text-sm">{errors.termsOfUse.message}</p>}
                {message && <Alert color={"danger"} title={message} />}
                <Button
                    type="submit"
                    color="success"
                    isLoading={isLoading}
                    fullWidth
                    className="mt-6"
                    isDisabled={!watch("privacyPolicy") || !watch("termsOfUse")}
                >
                    Регистрация
                </Button>
            </div>
        </form>
    );
}
