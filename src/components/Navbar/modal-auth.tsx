"use client";

import AuthForm from "@/components/auth/auth-form";

import ModalOrDrawer from "../modal-or-drawer";

interface Props {
    isOpen: boolean;
    onOpenChangeAction: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalAuth({ isOpen, onOpenChangeAction }: Props) {
    return (
        <ModalOrDrawer
            label="Добро пожаловать"
            isOpen={isOpen}
            onOpenChangeAction={onOpenChangeAction}
            size="md"
            contentClassName="max-w-lg"
        >
            <AuthForm />
        </ModalOrDrawer>
    );
}
