import { motion } from "framer-motion";

import React from "react";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Icon } from "@iconify/react";

interface GameModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    title: string;
    message: string;
    type: "win" | "lose" | "cashout" | "instructions";
    reward?: number;
}

export const GameModal: React.FC<GameModalProps> = ({ isOpen, onOpenChange, title, message, type, reward }) => {
    const getModalColor = () => {
        switch (type) {
            case "win":
                return "success";
            case "lose":
                return "danger";
            case "cashout":
                return "primary";
            default:
                return "secondary";
        }
    };

    const getIcon = () => {
        switch (type) {
            case "win":
                return "lucide:trophy";
            case "lose":
                return "lucide:frown";
            case "cashout":
                return "lucide:piggy-bank";
            default:
                return "lucide:info";
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col items-center gap-1">
                            <div className="mb-2 text-4xl">
                                <Icon icon={getIcon()} className={`text-${getModalColor()}`} />
                            </div>
                            <h2 className="text-2xl font-bold">{title}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <p className="text-center">{message}</p>
                            {reward !== undefined && (
                                <motion.div
                                    className="my-4 text-center text-3xl font-bold text-yellow-500"
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: [0.8, 1.2, 1] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    ${reward.toLocaleString()}
                                </motion.div>
                            )}
                        </ModalBody>
                        <ModalFooter className="justify-center">
                            <Button color={getModalColor()} onPress={onClose} size="lg" className="px-8 font-medium">
                                {type === "instructions" ? "Start Game" : "Continue"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
