"use client";

import { z } from "zod";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import PasswordInput from "@/components/password-input";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    email: z.string().min(1, "Email обязателен").email("Некорректный email"),
    password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            setIsLoading(true);
            setError(null);

            console.log("Attempting login with:", data.email);
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            console.log("SignIn result:", result);

            if (!result) {
                setError("Нет ответа от сервера");
                return;
            }

            if (result.error) {
                console.error("SignIn error:", result.error);
                setError(
                    result.error === "CredentialsSignin"
                        ? "Неверный email или пароль"
                        : "Ошибка сервера. Попробуйте позже",
                );
                return;
            }

            if (result.ok) {
                console.log("Login successful, redirecting...");
                router.push("/");
                return;
            }

            setError("Неизвестная ошибка авторизации");
        } catch (error) {
            console.error("Unexpected error:", error);
            setError("Произошла непредвиденная ошибка");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <div className="flex flex-col gap-4">
                <Input
                    label="Email"
                    type="email"
                    variant="bordered"
                    {...register("email")}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                />

                <PasswordInput
                    {...register("password")}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                />

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" color="success" isLoading={isLoading} fullWidth>
                    Вход
                </Button>
            </div>
        </form>
    );
}
