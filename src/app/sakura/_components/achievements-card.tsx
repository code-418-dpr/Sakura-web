"use client";

import { motion } from "framer-motion";

import React from "react";

import { Achievement } from "@/types/achievement";
import { Card, CardBody, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";

export const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const medalIcons = {
        bronze: "lucide:award",
        silver: "lucide:medal",
        gold: "lucide:trophy",
    };

    const medalColors = {
        bronze: "text-amber-600",
        silver: "text-slate-400",
        gold: "text-yellow-500",
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="overflow-hidden" shadow="sm">
                <CardBody className="p-0">
                    <div className="flex items-start p-4">
                        <div className="bg-content2 mr-4 flex-shrink-0 rounded-lg p-3">
                            <Icon
                                icon={medalIcons[achievement.medalType]}
                                className={`${medalColors[achievement.medalType]} text-4xl`}
                                width={48}
                                height={48}
                            />
                        </div>
                        <div className="flex-grow">
                            <div className="mb-1 flex items-center">
                                <h3 className="text-lg font-semibold">{achievement.title}</h3>
                                {achievement.completed && (
                                    <Icon
                                        icon="lucide:check-circle"
                                        className="text-success ml-2"
                                        width={20}
                                        height={20}
                                    />
                                )}
                            </div>
                            <p className="mb-3 text-sm text-slate-200">{achievement.description}</p>
                            <div className="flex items-center">
                                <Progress
                                    aria-label="Achievement progress"
                                    value={achievement.progress}
                                    className="max-w-full flex-grow"
                                    color={achievement.completed ? "success" : "primary"}
                                    size="sm"
                                />
                                <span className="text-small ml-2 text-slate-400">{achievement.progress}%</span>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </motion.div>
    );
};
