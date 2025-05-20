import { motion } from "framer-motion";

import React from "react";

import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

interface PrizeDisplayProps {
    prize: string | null;
    onClose: () => void;
}

const PrizeDisplay: React.FC<PrizeDisplayProps> = ({ prize, onClose }) => {
    if (!prize) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
            <Card className="sakura-bg sakura-border w-full max-w-md">
                <CardBody className="flex flex-col items-center gap-6 p-8">
                    <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 10 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    >
                        <Icon icon="lucide:gift" className="text-primary text-6xl" />
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center"
                    >
                        <h2 className="mb-2 text-2xl font-bold">Congratulations!</h2>
                        <p className="mb-4 text-lg">You won:</p>
                        <div className="text-primary bg-primary/10 rounded-lg p-4 text-xl font-bold">{prize}</div>
                    </motion.div>

                    <Button
                        color="primary"
                        variant="solid"
                        onPress={onClose}
                        className="mt-4"
                        startContent={<Icon icon="lucide:check" />}
                    >
                        Claim Prize
                    </Button>
                </CardBody>
            </Card>
        </motion.div>
    );
};

export default PrizeDisplay;
