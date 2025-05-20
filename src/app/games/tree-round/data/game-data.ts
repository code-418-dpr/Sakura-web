export interface LevelReward {
    level: number;
    reward: number;
}

export interface GameConfig {
    maxLevels: number;
    rewards: LevelReward[];
    pathOptions: number;
}

// Mock data for the game configuration
export const gameConfig: GameConfig = {
    maxLevels: 5,
    pathOptions: 3, // Number of choices at each fork
    rewards: [
        { level: 1, reward: 100 },
        { level: 2, reward: 300 },
        { level: 3, reward: 1000 },
        { level: 4, reward: 5000 },
        { level: 5, reward: 20000 },
    ],
};

// Helper function to get the reward for a specific level
export const getRewardForLevel = (level: number): number => {
    const levelData = gameConfig.rewards.find((r) => r.level === level);
    return levelData ? levelData.reward : 0;
};

// Helper to generate a random winning path
export const generateWinningPath = (maxLevels: number, pathOptions: number): number[] => {
    const winningPath: number[] = [];
    for (let i = 0; i < maxLevels; i++) {
        // Generate a random index (0 to pathOptions-1) for each level
        winningPath.push(Math.floor(Math.random() * pathOptions));
    }
    return winningPath;
};
