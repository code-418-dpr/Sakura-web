"use client";

import React from "react";

import LoginForm from "@/components/auth/login-form";
import { Tab, Tabs } from "@heroui/react";

import RegistrationFrom from "./registration-form";

export default function AuthForm() {
    return (
        <Tabs aria-label="RegisterForms" className="w-full" fullWidth>
            <Tab key="login" title="Вход">
                <LoginForm />
            </Tab>
            <Tab key="register" title="Регистрация">
                <RegistrationFrom />
            </Tab>
        </Tabs>
    );
}
