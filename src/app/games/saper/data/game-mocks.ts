// Prize values
export const PRIZES = [10, 20, 50, 100, 200, 500, 1000];

// Game configuration
export const GAME_CONFIG = {
    GRID_SIZE: 5,
    DEFAULT_BOMBS: 5,
};

// Pre-defined game boards for consistent testing/demos
export const MOCK_BOARDS = [
    {
        bombs: [2, 7, 12, 18, 23],
        prizes: [
            10, 20, 0, 50, 100, 200, 500, 0, 10, 20, 50, 100, 0, 200, 500, 10, 20, 0, 50, 100, 200, 500, 0, 10, 20,
        ],
    },
    {
        bombs: [0, 5, 10, 15, 20],
        prizes: [
            0, 50, 100, 200, 500, 0, 10, 20, 50, 100, 0, 200, 500, 10, 20, 0, 50, 100, 200, 500, 0, 10, 20, 50, 1000,
        ],
    },
    {
        bombs: [6, 7, 8, 11, 13],
        prizes: [
            10, 20, 50, 100, 200, 500, 0, 0, 0, 10, 20, 0, 50, 0, 100, 200, 500, 10, 20, 50, 100, 200, 500, 10, 1000,
        ],
    },
];

// Strongly-typed helper function to get a random mock board
export interface MockBoard {
    bombs: number[];
    prizes: number[];
}
export const getRandomMockBoard = (): MockBoard => {
    const randomIndex = Math.floor(Math.random() * MOCK_BOARDS.length);
    return MOCK_BOARDS[randomIndex];
};
