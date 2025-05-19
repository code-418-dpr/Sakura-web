"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";

// Убедитесь что тип определен

interface Props {
    children: React.ReactNode;
    title?: string;
}

export function SearchCardOrDrawer({ children, title }: Props) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return isDesktop ? (
        <SearchCard title={title}>{children}</SearchCard>
    ) : (
        <SearchDrawer isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} title={title}>
            {children}
        </SearchDrawer>
    );
}

function SearchCard({ children, title }: Props) {
    return (
        <div className="mt-6 w-full p-2 sm:w-1/4">
            <Card className="sticky top-20">
                <CardHeader className="text-xl">{title}</CardHeader>
                <CardBody>
                    <div className="max-h-[70vh] overflow-y-auto pr-2">{children}</div>
                </CardBody>
            </Card>
        </div>
    );
}

interface DrawerProps extends Props {
    isOpen: boolean;
    onOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

function SearchDrawer({ isOpen, onOpen, onOpenChange, children, title }: DrawerProps) {
    return (
        <>
            <Button
                variant="bordered"
                className="m-4 h-12 w-12"
                onPress={() => {
                    onOpen(true);
                }}
            >
                <span className="flex items-center">
                    <Icon icon="iconoir:search" width={18} height={18} className="mr-1" />
                </span>
            </Button>
            <Drawer placement="bottom" isOpen={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent className="p-4">
                    <DrawerHeader className="text-center text-2xl">{title}</DrawerHeader>
                    <DrawerBody>{children}</DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
