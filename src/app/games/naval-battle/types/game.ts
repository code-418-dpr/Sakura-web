export type CellState = "empty" | "ship" | "miss" | "hit" | "sunk";

export type Orientation = "horizontal" | "vertical";

export interface Coordinate {
    row: number;
    col: number;
}

export interface Ship {
    id: number;
    size: number;
    coordinates: Coordinate[];
    hits: number;
    orientation: Orientation;
}

export type Board = CellState[][];

export interface Player {
    board: Board;
    ships: Ship[];
    shotsBoard: CellState[][];
    score: number;
}

export interface GameState {
    player: Player;
    bot: Player;
    isPlayerTurn: boolean;
    gameStarted: boolean;
    gameOver: boolean;
    winner: "player" | "bot" | null;
    message: string;
    pot: number;
    playerBet: number;
}

export type GameAction =
    | { type: "PLACE_SHIPS" }
    | { type: "PLAYER_SHOT"; coordinate: Coordinate }
    | { type: "BOT_SHOT" }
    | { type: "START_GAME"; bet: number }
    | { type: "RESET_GAME" }
    | { type: "MANUAL_SHIP_PLACEMENT"; enabled: boolean }
    | { type: "PLACE_PLAYER_SHIP"; ship: Ship }
    | { type: "ROTATE_SHIP" }
    | { type: "CLEAR_PLAYER_SHIPS" };

// Add new placement state type
export interface PlacementState {
    enabled: boolean;
    currentShipSize: number;
    placedShips: Ship[];
    orientation: Orientation;
    hoverPosition: Coordinate | null;
}
