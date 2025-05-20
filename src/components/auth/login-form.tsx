"use client";

import { z } from "zod";

import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { signIn, useSession } from "next-auth/react";
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
    const { data: session } = useSession();
    useEffect(() => {
        if (session) {
            router.push("/");
            window.location.reload();
        }
    }, [session, router]);
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

            // Правильный вызов signIn с обработкой ошибок
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
                callbackUrl: "/",
            });

            if (result?.error) {
                setError("Неверный email или пароль");
                return;
            }

            // Ручной редирект при успехе
            router.push("/");
            router.refresh();
        } catch (error) {
            setError("Ошибка сервера: " + (error as Error).message);
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
