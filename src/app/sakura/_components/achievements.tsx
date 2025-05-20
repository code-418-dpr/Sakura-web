import React from "react";

import { AchievementCard } from "@/app/sakura/_components/achievements-card";
import { achievements } from "@/mocks/achievements";

export const AchievementGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
        </div>
    );
};
