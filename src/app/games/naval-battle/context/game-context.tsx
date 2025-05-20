import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

import type {
    GameState as BaseGameState,
    Board,
    CellState,
    Coordinate,
    GameAction,
    Orientation,
    PlacementState,
    Ship,
} from "../types/game";

// Расширяем GameState, чтобы внутри него был точный PlacementState
type GameState = BaseGameState & { placement: PlacementState };

const ROWS = 10;
const COLS = 10;
const SHIP_SIZES = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
export const ROW_LABELS = ["A", "B", "C", "D", "F", "G", "H", "I", "J", "K"];

// Генерация пустой доски 10×10 с типом CellState[][]
const createEmptyBoard = (): Board =>
    Array.from({ length: ROWS }, () => Array.from({ length: COLS }, (): CellState => "empty")) as Board;

const isValidPlacement = (board: Board, size: number, row: number, col: number, orientation: Orientation): boolean => {
    if ((orientation === "horizontal" && col + size > COLS) || (orientation === "vertical" && row + size > ROWS)) {
        return false;
    }
    for (let r = Math.max(0, row - 1); r <= Math.min(ROWS - 1, row + (orientation === "vertical" ? size : 1)); r++) {
        for (
            let c = Math.max(0, col - 1);
            c <= Math.min(COLS - 1, col + (orientation === "horizontal" ? size : 1));
            c++
        ) {
            if (board[r][c] === "ship") return false;
        }
    }
    return true;
};

const placeShipsRandomly = (board: Board): { board: Board; ships: Ship[] } => {
    const newBoard = board.map((row) => [...row]);
    const ships: Ship[] = [];
    let shipId = 1;

    for (const size of SHIP_SIZES) {
        let placed = false;
        while (!placed) {
            const orientation: Orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
            const row = Math.floor(Math.random() * ROWS);
            const col = Math.floor(Math.random() * COLS);

            if (isValidPlacement(newBoard, size, row, col, orientation)) {
                const coords: Coordinate[] = [];
                for (let i = 0; i < size; i++) {
                    const r = orientation === "vertical" ? row + i : row;
                    const c = orientation === "horizontal" ? col + i : col;
                    newBoard[r][c] = "ship";
                    coords.push({ row: r, col: c });
                }
                ships.push({ id: shipId++, size, coordinates: coords, hits: 0, orientation });
                placed = true;
            }
        }
    }

    return { board: newBoard, ships };
};

const findShipAtCoordinate = (ships: Ship[], coordinate: Coordinate): Ship | undefined =>
    ships.find((ship) =>
        ship.coordinates.some((coord) => coord.row === coordinate.row && coord.col === coordinate.col),
    );

const isShipSunk = (ship: Ship): boolean => ship.hits === ship.size;

export const allShipsPlaced = (placedShips: Ship[]): boolean => {
    const counts: Record<number, number> = { 4: 0, 3: 0, 2: 0, 1: 0 };
    placedShips.forEach((s) => {
        counts[s.size] = (counts[s.size] || 0) + 1;
    });
    return counts[4] === 1 && counts[3] === 2 && counts[2] === 3 && counts[1] === 4;
};

const createBoardFromShips = (ships: Ship[]): Board => {
    const b = createEmptyBoard();
    ships.forEach((ship) => {
        ship.coordinates.forEach((coord) => {
            b[coord.row][coord.col] = "ship";
        });
    });
    return b;
};

const initialState: GameState = {
    player: {
        board: createEmptyBoard(),
        ships: [],
        shotsBoard: createEmptyBoard(),
        score: 0,
    },
    bot: {
        board: createEmptyBoard(),
        ships: [],
        shotsBoard: createEmptyBoard(),
        score: 0,
    },
    isPlayerTurn: true,
    gameStarted: false,
    gameOver: false,
    winner: null,
    message: "Welcome to Naval Battle Lottery! Place your bet to start.",
    pot: 0,
    playerBet: 0,
    placement: {
        enabled: false,
        currentShipSize: 4,
        placedShips: [],
        orientation: "horizontal",
        hoverPosition: null,
    },
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case "START_GAME": {
            if (action.bet <= 0) {
                return { ...state, message: "Please place a valid bet to start the game." };
            }
            const playerSetup =
                state.placement.enabled && state.placement.placedShips.length > 0
                    ? { board: createBoardFromShips(state.placement.placedShips), ships: state.placement.placedShips }
                    : placeShipsRandomly(createEmptyBoard());
            const botSetup = placeShipsRandomly(createEmptyBoard());
            const isFirst = Math.random() < 0.5;

            return {
                ...state,
                player: {
                    ...state.player,
                    board: playerSetup.board,
                    ships: playerSetup.ships,
                    shotsBoard: createEmptyBoard(),
                },
                bot: {
                    ...state.bot,
                    board: botSetup.board,
                    ships: botSetup.ships,
                    shotsBoard: createEmptyBoard(),
                },
                gameStarted: true,
                isPlayerTurn: isFirst,
                gameOver: false,
                winner: null,
                message: isFirst ? "Game started! Your turn to fire." : "Game started! Bot fires first.",
                pot: action.bet * 2,
                playerBet: action.bet,
                placement: { ...initialState.placement },
            };
        }

        case "PLAYER_SHOT": {
            if (!state.gameStarted || !state.isPlayerTurn || state.gameOver) return state;
            const { row, col } = action.coordinate;
            if (state.player.shotsBoard[row][col] !== "empty") {
                return { ...state, message: "You already fired at this location. Try another one." };
            }

            const shots = state.player.shotsBoard.map((r) => [...r]);
            let message = "";
            let turn = false;
            let over: boolean = state.gameOver;
            let win = state.winner;

            const cell = state.bot.board[row][col];
            if (cell === "ship" || cell === "hit") {
                const ship = findShipAtCoordinate(state.bot.ships, { row, col });
                if (ship) {
                    const updated = state.bot.ships.map((s) => (s.id === ship.id ? { ...s, hits: s.hits + 1 } : s));
                    const target = updated.find((s) => s.id === ship.id)!;
                    if (isShipSunk(target)) {
                        shots[row][col] = "sunk";
                        target.coordinates.forEach((c) => {
                            shots[c.row][c.col] = "sunk";
                        });
                        const all = updated.every(isShipSunk);
                        if (all) {
                            over = true;
                            win = "player";
                            message = `You sunk all enemy ships and won the lottery!`;
                        } else {
                            message = `You sunk a ${target.size}-deck ship! Your turn again.`;
                        }
                    } else {
                        shots[row][col] = "hit";
                        message = "Wounded! Your turn again.";
                    }
                    turn = true;

                    const newPlayerScore = win === "player" ? state.player.score + state.pot : state.player.score;

                    return {
                        ...state,
                        player: { ...state.player, shotsBoard: shots, score: newPlayerScore },
                        bot: { ...state.bot, ships: updated },
                        isPlayerTurn: turn,
                        message,
                        gameOver: over,
                        winner: win,
                    };
                }
            } else {
                shots[row][col] = "miss";
                message = "Past! Bot's turn.";
                return {
                    ...state,
                    player: { ...state.player, shotsBoard: shots },
                    isPlayerTurn: false,
                    message,
                };
            }

            return state;
        }

        case "BOT_SHOT": {
            if (state.gameOver || state.isPlayerTurn) return state;

            // 1) выбираем координаты выстрела бота
            const { row, col } = (() => {
                // Ищем wounded
                for (let r = 0; r < ROWS; r++) {
                    for (let c = 0; c < COLS; c++) {
                        if (state.bot.shotsBoard[r][c] === "hit") {
                            const adj: Coordinate[] = [
                                { row: r - 1, col: c },
                                { row: r + 1, col: c },
                                { row: r, col: c - 1 },
                                { row: r, col: c + 1 },
                            ];
                            for (const cell of adj) {
                                if (
                                    cell.row >= 0 &&
                                    cell.row < ROWS &&
                                    cell.col >= 0 &&
                                    cell.col < COLS &&
                                    state.bot.shotsBoard[cell.row][cell.col] === "empty"
                                ) {
                                    return cell;
                                }
                            }
                        }
                    }
                }
                // Случайный
                let rr: number, cc: number;
                do {
                    rr = Math.floor(Math.random() * ROWS);
                    cc = Math.floor(Math.random() * COLS);
                } while (state.bot.shotsBoard[rr][cc] !== "empty");
                return { row: rr, col: cc };
            })();

            // 2) создаём копии досок
            const botShots = state.bot.shotsBoard.map((r) => [...r]);
            const playerBoard = state.player.board.map((r) => [...r]);

            // 3) подготовим переменные для обновлённого состояния
            let message = "";
            let turn = true;
            let over = state.gameOver;
            let win = state.winner;

            // **ВАЖНО**: объявляем заранее, чтобы не было «Cannot find name 'updated'»
            let updatedShips = state.player.ships;

            const cell = playerBoard[row][col];
            if (cell === "ship" || cell === "hit") {
                // 4) попал по кораблю
                const ship = findShipAtCoordinate(state.player.ships, { row, col });
                if (ship) {
                    // 4.1) увеличиваем попадания в этот корабль
                    updatedShips = state.player.ships.map((s) => (s.id === ship.id ? { ...s, hits: s.hits + 1 } : s));
                    const target = updatedShips.find((s) => s.id === ship.id)!;

                    // 4.2) отмечаем попадание на досках
                    playerBoard[row][col] = "hit";
                    botShots[row][col] = "hit";

                    // 4.3) если затонул — помечаем ВСЕ его клетки sunk
                    if (isShipSunk(target)) {
                        target.coordinates.forEach((c) => {
                            playerBoard[c.row][c.col] = "sunk";
                            botShots[c.row][c.col] = "sunk";
                        });
                        const allSunk = updatedShips.every(isShipSunk);
                        if (allSunk) {
                            over = true;
                            win = "bot";
                            message = "Game over! Bot sunk all your ships and won the lottery.";
                        } else {
                            message = `Bot sunk your ${target.size}-deck ship! Bot's turn again.`;
                        }
                    } else {
                        message = "Bot wounded your ship! Bot's turn again.";
                    }

                    turn = false;
                }
            } else {
                // 5) промазал
                playerBoard[row][col] = "miss";
                botShots[row][col] = "miss";
                message = "Bot missed! Your turn.";
            }

            // 6) пересчитываем счёт бота, если он выиграл
            const newBotScore = win === "bot" ? state.bot.score + state.pot : state.bot.score;

            // 7) возвращаем обновлённое состояние с правильным updatedShips
            return {
                ...state,
                player: {
                    ...state.player,
                    board: playerBoard,
                    ships: updatedShips, // <--- здесь именно updatedShips
                },
                bot: {
                    ...state.bot,
                    shotsBoard: botShots,
                    score: newBotScore,
                },
                isPlayerTurn: turn,
                message,
                gameOver: over,
                winner: win,
            };
        }

        case "RESET_GAME":
            return {
                ...initialState,
                player: { ...initialState.player, score: state.player.score },
                bot: { ...initialState.bot, score: state.bot.score },
            };

        case "MANUAL_SHIP_PLACEMENT":
            return {
                ...state,
                placement: {
                    enabled: action.enabled,
                    currentShipSize: 4,
                    placedShips: [],
                    orientation: "horizontal",
                    hoverPosition: null,
                },
                message: action.enabled
                    ? "Place your ships on the board. Start with the 4-deck ship."
                    : "Ships will be placed randomly.",
            };

        case "PLACE_PLAYER_SHIP": {
            const { ship } = action;
            const placed = state.placement.placedShips;
            const count = placed.filter((s) => s.size === state.placement.currentShipSize).length;
            let nextSize = state.placement.currentShipSize;
            let msg = state.message;

            if (nextSize === 4 && count === 0) {
                nextSize = 3;
                msg = "Place your 3-deck ships (2 ships).";
            } else if (nextSize === 3 && count === 1) {
                nextSize = 2;
                msg = "Place your 2-deck ships (3 ships).";
            } else if (nextSize === 2 && count === 2) {
                nextSize = 1;
                msg = "Place your 1-deck ships (4 ships).";
            } else if (nextSize === 1 && count === 3) {
                msg = "All ships placed! You can now start the game.";
            }

            return {
                ...state,
                placement: {
                    ...state.placement,
                    placedShips: [...state.placement.placedShips, ship],
                    currentShipSize: nextSize,
                },
                message: msg,
            };
        }

        case "ROTATE_SHIP":
            return {
                ...state,
                placement: {
                    ...state.placement,
                    orientation: state.placement.orientation === "horizontal" ? "vertical" : "horizontal",
                },
            };

        case "CLEAR_PLAYER_SHIPS":
            return {
                ...state,
                placement: {
                    ...state.placement,
                    placedShips: [],
                    currentShipSize: 4,
                },
                message: "Ship placement cleared. Place your 4-deck ship.",
            };

        default:
            return state;
    }
};

export interface GameContextType {
    state: GameState;
    dispatch: React.Dispatch<GameAction>;
    ROW_LABELS: typeof ROW_LABELS;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (state.gameStarted && !state.isPlayerTurn && !state.gameOver) {
            timeout = setTimeout(() => {
                dispatch({ type: "BOT_SHOT" });
            }, 800);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [state.bot.shotsBoard, state.isPlayerTurn, state.gameStarted, state.gameOver]);

    const value = useMemo(() => ({ state, dispatch, ROW_LABELS }), [state]);

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error("useGame must be used within GameProvider");
    return ctx;
};
