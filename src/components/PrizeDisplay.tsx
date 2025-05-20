import React from "react";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Icon } from "@iconify/react";

interface PrizeDisplayProps {
    prize: string | null;
    onClose: () => void;
}

export const PrizeDisplay: React.FC<PrizeDisplayProps> = ({ prize, onClose }) => (
    <Modal isOpen={!!prize} hideCloseButton>
        <ModalContent>
            <ModalHeader>Ваш выигрыш!</ModalHeader>
            <ModalBody>
                <div className="flex flex-col items-center gap-4">
                    <Icon icon="iconoir:leaf" className="text-4xl text-green-500" />
                    <p className="text-xl font-bold">{prize}</p>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button fullWidth color="primary" onPress={onClose}>
                    Понятно
                </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
);
