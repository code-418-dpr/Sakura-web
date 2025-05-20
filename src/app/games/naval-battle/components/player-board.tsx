import React, { useMemo, useState } from "react";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

import { useGame } from "../context/game-context";
import type { CellState, Coordinate, GameAction, GameState, PlacementState, Ship } from "../types/game";

export const PlayerBoard: React.FC = () => {
    // Приводим хук useGame к точному типу контекста
    const { state, dispatch, ROW_LABELS } = useGame() as {
        state: GameState & { placement: PlacementState };
        dispatch: React.Dispatch<GameAction>;
        ROW_LABELS: string[];
    };

    const board: CellState[][] = state.player.board;
    const placement: PlacementState = state.placement;
    const [hoverPosition, setHoverPosition] = useState<Coordinate | null>(null);

    const canPlaceShip = (row: number, col: number): boolean => {
        if (!placement.enabled || state.gameStarted) return false;
        const { currentShipSize, orientation, placedShips } = placement;

        if (
            (orientation === "horizontal" && col + currentShipSize > 10) ||
            (orientation === "vertical" && row + currentShipSize > 10)
        ) {
            return false;
        }

        const tempBoard: CellState[][] = createEmptyBoard();
        placedShips.forEach((ship) => {
            ship.coordinates.forEach((coord) => {
                tempBoard[coord.row][coord.col] = "ship";
            });
        });

        for (
            let r = Math.max(0, row - 1);
            r <= Math.min(9, row + (orientation === "vertical" ? currentShipSize : 1));
            r++
        ) {
            for (
                let c = Math.max(0, col - 1);
                c <= Math.min(9, col + (orientation === "horizontal" ? currentShipSize : 1));
                c++
            ) {
                if (tempBoard[r][c] === "ship") return false;
            }
        }

        return true;
    };

    const getShipCells = (row: number, col: number): Coordinate[] => {
        const { currentShipSize, orientation } = placement;
        const cells: Coordinate[] = [];
        for (let i = 0; i < currentShipSize; i++) {
            const r = orientation === "vertical" ? row + i : row;
            const c = orientation === "horizontal" ? col + i : col;
            if (r < 10 && c < 10) cells.push({ row: r, col: c });
        }
        return cells;
    };

    const handleCellHover = (row: number, col: number) => {
        if (!placement.enabled || state.gameStarted) return;
        setHoverPosition({ row, col });
    };

    const handleCellClick = (row: number, col: number) => {
        if (!placement.enabled || state.gameStarted) return;
        if (placement.placedShips.length >= 10) return;
        if (canPlaceShip(row, col)) {
            const shipCells = getShipCells(row, col);
            const newShip: Ship = {
                id: placement.placedShips.length + 1,
                size: placement.currentShipSize,
                coordinates: shipCells,
                hits: 0,
                orientation: placement.orientation,
            };
            dispatch({ type: "PLACE_PLAYER_SHIP", ship: newShip });
        }
    };

    const handleRotateShip = () => {
        if (!placement.enabled || state.gameStarted) return;
        dispatch({ type: "ROTATE_SHIP" });
    };

    const hoverCells: Coordinate[] =
        !state.gameStarted && hoverPosition ? getShipCells(hoverPosition.row, hoverPosition.col) : [];
    const isValidHover =
        !state.gameStarted && hoverPosition ? canPlaceShip(hoverPosition.row, hoverPosition.col) : false;

    const visualBoard: CellState[][] = useMemo(() => {
        if (state.gameStarted) return board;
        if (!placement.enabled) return board;

        const newBoard: CellState[][] = createEmptyBoard();
        placement.placedShips.forEach((ship) => {
            ship.coordinates.forEach((coord) => {
                newBoard[coord.row][coord.col] = "ship";
            });
        });
        return newBoard;
    }, [board, placement.enabled, placement.placedShips, state.gameStarted]);

    return (
        <div className="relative">
            <div className="mb-1 flex">
                <div className="h-8 w-8" />
                {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="flex h-8 w-8 items-center justify-center text-sm font-medium">
                        {i + 1}
                    </div>
                ))}
            </div>

            {visualBoard.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                    <div className="flex h-8 w-8 items-center justify-center text-sm font-medium">
                        {ROW_LABELS[rowIndex]}
                    </div>

                    {row.map((cell, colIndex) => {
                        const isHoverCell = hoverCells.some((c) => c.row === rowIndex && c.col === colIndex);
                        return (
                            <div
                                key={colIndex}
                                className={`border-default-200 flex h-8 w-8 items-center justify-center border ${cell === "ship" ? "bg-primary-100" : ""} ${cell === "hit" ? "bg-danger-100" : ""} ${cell === "miss" ? "bg-default-100" : ""} ${cell === "sunk" ? "bg-danger-200" : ""} ${isHoverCell && isValidHover ? "bg-success-100" : ""} ${isHoverCell && !isValidHover ? "bg-danger-100" : ""} ${
                                    placement.enabled && !state.gameStarted ? "hover:bg-default-50 cursor-pointer" : ""
                                } `}
                                onMouseEnter={() => {
                                    handleCellHover(rowIndex, colIndex);
                                }}
                                onClick={() => {
                                    handleCellClick(rowIndex, colIndex);
                                }}
                            >
                                {cell === "ship" && <div className="bg-primary-400 h-4 w-4 rounded-full" />}
                                {cell === "hit" && <Icon icon="lucide:x" className="text-danger-500" />}
                                {cell === "miss" && <div className="bg-default-400 h-2 w-2 rounded-full" />}
                                {cell === "sunk" && <Icon icon="lucide:anchor" className="text-danger-600" />}
                                {isHoverCell && isValidHover && (
                                    <div className="bg-success-400 h-4 w-4 rounded-full opacity-50" />
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}

            {placement.enabled && !state.gameStarted && (
                <div className="absolute right-0 -bottom-12 left-0 flex justify-center">
                    <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={handleRotateShip}
                        startContent={<Icon icon="lucide:rotate-cw" />}
                    >
                        Rotate Ship
                    </Button>
                </div>
            )}

            {placement.enabled && !state.gameStarted && (
                <div className="absolute -top-10 right-0 left-0 flex justify-center">
                    <div className="bg-content2 rounded-md px-3 py-1 text-sm">
                        Placing: {placement.currentShipSize}-deck ship ({placement.orientation})
                    </div>
                </div>
            )}
        </div>
    );
};

// Помощник: создаёт чистую доску 10×10
const createEmptyBoard = (): CellState[][] =>
    Array.from<CellState[], CellState[]>({ length: 10 }, () =>
        Array.from<CellState, CellState>({ length: 10 }, () => "empty"),
    );
