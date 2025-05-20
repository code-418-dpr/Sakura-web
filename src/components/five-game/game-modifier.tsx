import { AnimatePresence, motion } from "framer-motion";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import React from "react";

import { Button, Card, CardBody, Input, Progress, Tooltip, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";

// Game configuration
const GAME_CONFIG = {
    minBet: 10,
    maxBet: 10000,
    initialBalance: 5000,
    baseChance: 0.99, // 55% chance of continuing
    minMultiplier: 0.1,
    maxMultiplier: 3.0,
    updateInterval: 50, // ms between updates - adjusted to be more responsive but still clickable
    graphDataPoints: 60, // Number of points to show on graph
    houseEdge: 0.05, // 5% house edge - adjusted for better player experience
};

// Types
interface GameState {
    isPlaying: boolean;
    currentMultiplier: number;
    targetMultiplier: number;
    betAmount: number;
    balance: number;
    gameHistory: {
        bet: number;
        multiplier: number;
        win: boolean;
        payout: number;
    }[];
    graphData: {
        time: number;
        multiplier: number;
    }[];
}

// Helper functions
const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const formatMultiplier = (multiplier: number): string => {
    return `x${multiplier.toFixed(2)}`;
};

// Calculate chance of continuing based on current multiplier
const calculateContinueChance = (multiplier: number): number => {
    // As multiplier grows, chance decreases exponentially
    const baseChance = GAME_CONFIG.baseChance;

    // Adjust the curve to center around 1.0 with 20% deviation
    if (multiplier <= 1.0) {
        // Higher chance below 1.0
        return baseChance;
    } else {
        // Decreasing chance above 1.0, more aggressive decline
        return baseChance * Math.pow(0.8, (multiplier - 1.0) * 2);
    }
};

// Sakura petal component
const SakuraPetal: React.FC<{ index: number }> = ({ index }) => {
    const size = React.useMemo(() => Math.random() * 20 + 10, []);
    const xPos = React.useMemo(() => Math.random() * 100, []);
    const delay = React.useMemo(() => Math.random() * 5, []);
    const duration = React.useMemo(() => Math.random() * 3 + 5, []);
    const rotation = React.useMemo(() => Math.random() * 360, []);

    return (
        <motion.div
            key={index}
            className="absolute"
            initial={{
                top: -50,
                left: `${xPos}%`,
                rotate: rotation,
                opacity: 0.8,
            }}
            animate={{
                top: "120%",
                rotate: rotation + 360,
                opacity: 0,
            }}
            transition={{
                duration: duration,
                delay: delay,
                repeat: Infinity,
                ease: "linear",
            }}
            style={{ zIndex: 10 }}
        >
            <Icon icon="lucide:flower" className="text-primary-400" style={{ fontSize: size }} />
        </motion.div>
    );
};

export const CSGOModifierGame: React.FC = () => {
    const [state, setState] = React.useState<GameState>({
        isPlaying: false,
        currentMultiplier: 1.0,
        targetMultiplier: 0,
        betAmount: 100,
        balance: GAME_CONFIG.initialBalance,
        gameHistory: [],
        graphData: Array.from({ length: GAME_CONFIG.graphDataPoints }, (_, i) => ({
            time: i,
            multiplier: 1.0,
        })),
    });

    const gameTimerRef = React.useRef<NodeJS.Timeout | null>(null);
    const graphUpdateTimerRef = React.useRef<NodeJS.Timeout | null>(null);

    // Add state for tracking max multiplier from recent games
    const [, setRecentMaxMultiplier] = React.useState<number>(GAME_CONFIG.maxMultiplier);

    // Input handlers
    const handleBetAmountChange = (value: string) => {
        const numValue = parseFloat(value) || 0;
        setState((prev) => ({
            ...prev,
            betAmount: Math.min(Math.max(numValue, GAME_CONFIG.minBet), GAME_CONFIG.maxBet),
        }));
    };

    const incrementBet = (amount: number) => {
        setState((prev) => ({
            ...prev,
            betAmount: Math.min(prev.betAmount + amount, GAME_CONFIG.maxBet),
        }));
    };

    const decrementBet = (amount: number) => {
        setState((prev) => ({
            ...prev,
            betAmount: Math.max(prev.betAmount - amount, GAME_CONFIG.minBet),
        }));
    };

    // Game logic
    const startGame = () => {
        if (state.balance < state.betAmount) {
            addToast({
                title: "Insufficient Balance",
                description: "You don't have enough funds to place this bet.",
                color: "danger",
            });
            return;
        }

        // Deduct bet amount from balance
        setState((prev) => ({
            ...prev,
            isPlaying: true,
            currentMultiplier: GAME_CONFIG.minMultiplier,
            balance: prev.balance - prev.betAmount,
            graphData: Array.from({ length: GAME_CONFIG.graphDataPoints }, (_, i) => ({
                time: i,
                multiplier: GAME_CONFIG.minMultiplier,
            })),
        }));

        // Start game timer
        gameTimerRef.current = setInterval(() => {
            setState((prev) => {
                // Calculate chance of continuing
                const continueChance = calculateContinueChance(prev.currentMultiplier);

                // Random check if game should continue
                if (Math.random() > continueChance) {
                    // Game over - player lost
                    clearInterval(gameTimerRef.current!);
                    clearInterval(graphUpdateTimerRef.current!);

                    addToast({
                        title: "Game Over!",
                        description: `Modifier burned at ${formatMultiplier(prev.currentMultiplier)}`,
                        color: "danger",
                    });

                    // Update recent max multiplier
                    updateRecentMaxMultiplier(prev.currentMultiplier);

                    return {
                        ...prev,
                        isPlaying: false,
                        gameHistory: [
                            {
                                bet: prev.betAmount,
                                multiplier: prev.currentMultiplier,
                                win: false,
                                payout: 0,
                            },
                            ...prev.gameHistory.slice(0, 9), // Keep last 10 games
                        ],
                    };
                }

                // Game continues - increase multiplier
                // Adjust the growth rate to make average around 1.0 with 20% deviation
                const growthRate = 0.01;
                const newMultiplier = Math.min(prev.currentMultiplier + growthRate, GAME_CONFIG.maxMultiplier);

                // Update graph data
                const newGraphData = [
                    ...prev.graphData.slice(1),
                    { time: prev.graphData[prev.graphData.length - 1].time + 1, multiplier: newMultiplier },
                ];

                return {
                    ...prev,
                    currentMultiplier: newMultiplier,
                    graphData: newGraphData,
                };
            });
        }, GAME_CONFIG.updateInterval);
    };

    const stopGame = () => {
        if (!state.isPlaying) return;

        clearInterval(gameTimerRef.current!);
        clearInterval(graphUpdateTimerRef.current!);

        // Calculate winnings with house edge
        const winnings = state.betAmount * state.currentMultiplier * (1 - GAME_CONFIG.houseEdge);

        // Update recent max multiplier
        updateRecentMaxMultiplier(state.currentMultiplier);

        setState((prev) => ({
            ...prev,
            isPlaying: false,
            balance: prev.balance + winnings,
            gameHistory: [
                {
                    bet: prev.betAmount,
                    multiplier: state.currentMultiplier,
                    win: true,
                    payout: winnings,
                },
                ...prev.gameHistory.slice(0, 9), // Keep last 10 games
            ],
        }));

        addToast({
            title: "Winner!",
            description: `You won ${formatCurrency(winnings)} at ${formatMultiplier(state.currentMultiplier)}`,
            color: "success",
        });
    };

    // Update the recent max multiplier based on last 3 games
    const updateRecentMaxMultiplier = (currentMultiplier: number) => {
        // Always set the upper bound to the current multiplier plus a small margin
        setRecentMaxMultiplier(Math.min(currentMultiplier * 1.1, GAME_CONFIG.maxMultiplier));
    };

    // Update the graph color based on the multiplier
    const getGraphLineColor = (multiplier: number) => {
        return multiplier >= 1 ? "hsl(var(--heroui-success-500))" : "hsl(var(--heroui-danger-500))";
    };

    // Determine the history item color based on win/loss and multiplier
    const getHistoryItemColor = (game: { win: boolean; multiplier: number }) => {
        if (!game.win) return "bg-danger-100/20"; // Red for losses
        if (game.multiplier < 1) return "bg-warning-100/20"; // Yellow for wins below 1x
        return "bg-success-100/20"; // Green for wins above 1x
    };

    // Determine the history text color based on win/loss and multiplier
    const getHistoryTextColor = (game: { win: boolean; multiplier: number }) => {
        if (!game.win) return "text-danger"; // Red for losses
        if (game.multiplier < 1) return "text-warning"; // Yellow for wins below 1x
        return "text-success"; // Green for wins above 1x
    };

    // Calculate the exact payout amount
    const calculatePayout = (bet: number, multiplier: number): number => {
        // Fix precision issues by using Math.round to 2 decimal places
        return Math.round(bet * multiplier * (1 - GAME_CONFIG.houseEdge) * 100) / 100;
    };

    // Cleanup timers on unmount
    React.useEffect(() => {
        return () => {
            if (gameTimerRef.current) clearInterval(gameTimerRef.current);
            if (graphUpdateTimerRef.current) clearInterval(graphUpdateTimerRef.current);
        };
    }, []);

    // Generate petals for animation
    const petalCount = 15;
    const petals = Array.from({ length: petalCount }, (_, i) => <SakuraPetal key={i} index={i} />);

    return (
        <Card className="bg-content1 w-full max-w-4xl overflow-visible">
            <CardBody className="p-6">
                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-foreground text-2xl font-bold">CS:GO Style Modifier Game</h1>
                        <div className="flex items-center gap-2">
                            <Icon icon="lucide:wallet" className="text-primary" />
                            <span className="text-lg font-semibold">{formatCurrency(state.balance)}</span>
                        </div>
                    </div>

                    {/* Game Area */}
                    <div className="bg-content2 relative overflow-hidden rounded-xl p-6">
                        {/* Sakura petals animation */}
                        <AnimatePresence>{state.isPlaying && petals}</AnimatePresence>

                        {/* Rearranged layout - Graph and Multiplier side by side */}
                        <div className="mb-6 flex flex-col gap-6 md:flex-row">
                            {/* Graph - Now on the left with square aspect ratio */}
                            <div className="bg-content1 aspect-square h-48 w-full rounded-lg p-2 md:h-auto md:flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={state.graphData}
                                        margin={{ right: 10, left: 0, top: 10, bottom: 10 }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="hsl(var(--heroui-default-200))"
                                            horizontalPoints={Array.from({ length: 30 }, (_, i) => i)}
                                            verticalPoints={Array.from({ length: 30 }, (_, i) => i)}
                                        />
                                        <XAxis dataKey="time" hide />
                                        <YAxis domain={[0, state.currentMultiplier * 1.1]} hide />
                                        <defs>
                                            <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop
                                                    offset="5%"
                                                    stopColor="hsl(var(--heroui-success-500))"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="hsl(var(--heroui-success-500))"
                                                    stopOpacity={0.3}
                                                />
                                            </linearGradient>
                                            <linearGradient id="dangerGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop
                                                    offset="5%"
                                                    stopColor="hsl(var(--heroui-danger-500))"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="hsl(var(--heroui-danger-500))"
                                                    stopOpacity={0.3}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <Line
                                            type="monotone"
                                            dataKey="multiplier"
                                            stroke={getGraphLineColor(state.currentMultiplier)}
                                            strokeWidth={3}
                                            dot={false}
                                            isAnimationActive={true}
                                            activeDot={{ r: 6 }}
                                            // Start from the bottom of the chart
                                            fill={
                                                state.currentMultiplier >= 1
                                                    ? "url(#successGradient)"
                                                    : "url(#dangerGradient)"
                                            }
                                            // Make the line smoother
                                            connectNulls={true}
                                        />
                                        {/* Add a dot at the start point */}
                                        <Line
                                            data={[state.graphData[0]]}
                                            type="monotone"
                                            dataKey="multiplier"
                                            stroke={getGraphLineColor(state.currentMultiplier)}
                                            strokeWidth={0}
                                            dot={{ r: 4, fill: getGraphLineColor(state.currentMultiplier) }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Current multiplier display - Now on the right */}
                            <div className="relative z-20 flex flex-col items-center justify-center md:w-1/3">
                                <span className="text-default-600 mb-2 text-sm">Current Multiplier</span>
                                <motion.div
                                    className="text-5xl font-bold"
                                    animate={{
                                        scale: state.isPlaying ? [1, 1.05, 1] : 1,
                                        color: state.isPlaying
                                            ? [
                                                  "hsl(var(--heroui-primary-500))",
                                                  "hsl(var(--heroui-warning-500))",
                                                  "hsl(var(--heroui-danger-500))",
                                              ]
                                            : "hsl(var(--heroui-foreground))",
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        repeat: state.isPlaying ? Infinity : 0,
                                        repeatType: "reverse",
                                    }}
                                >
                                    {formatMultiplier(state.currentMultiplier)}
                                </motion.div>

                                {/* Progress indicator */}
                                <div className="mt-4 w-full max-w-md">
                                    <Progress
                                        aria-label="Multiplier progress"
                                        value={(state.currentMultiplier / GAME_CONFIG.maxMultiplier) * 100}
                                        color={
                                            state.currentMultiplier > 2
                                                ? "danger"
                                                : state.currentMultiplier > 1.5
                                                  ? "warning"
                                                  : "primary"
                                        }
                                        className="h-2"
                                        isStriped={state.isPlaying}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Game controls */}
                        <div className="flex flex-col gap-4">
                            {/* Bet amount controls */}
                            <div className="flex items-center gap-2">
                                <Button
                                    isIconOnly
                                    color="primary"
                                    variant="flat"
                                    onPress={() => {
                                        decrementBet(10);
                                    }}
                                    isDisabled={state.isPlaying || state.betAmount <= GAME_CONFIG.minBet}
                                >
                                    <Icon icon="lucide:minus" />
                                </Button>

                                <Input
                                    type="number"
                                    value={state.betAmount.toString()}
                                    onValueChange={handleBetAmountChange}
                                    startContent={<Icon icon="lucide:dollar-sign" className="text-default-400" />}
                                    endContent={
                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="flat"
                                                color="primary"
                                                isDisabled={state.isPlaying}
                                                onPress={() => {
                                                    setState((prev) => ({
                                                        ...prev,
                                                        betAmount: Math.floor(prev.balance / 2),
                                                    }));
                                                }}
                                            >
                                                1/2
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="flat"
                                                color="primary"
                                                isDisabled={state.isPlaying}
                                                onPress={() => {
                                                    setState((prev) => ({ ...prev, betAmount: prev.balance }));
                                                }}
                                            >
                                                Max
                                            </Button>
                                        </div>
                                    }
                                    isDisabled={state.isPlaying}
                                    className="flex-1"
                                />

                                <Button
                                    isIconOnly
                                    color="primary"
                                    variant="flat"
                                    onPress={() => {
                                        incrementBet(10);
                                    }}
                                    isDisabled={state.isPlaying || state.betAmount >= GAME_CONFIG.maxBet}
                                >
                                    <Icon icon="lucide:plus" />
                                </Button>
                            </div>

                            {/* Game action buttons */}
                            <div className="flex gap-4">
                                <Button
                                    color="primary"
                                    variant="solid"
                                    size="lg"
                                    className="flex-1"
                                    startContent={<Icon icon={state.isPlaying ? "lucide:hand" : "lucide:play"} />}
                                    onPress={state.isPlaying ? stopGame : startGame}
                                    isDisabled={state.isPlaying && state.currentMultiplier < GAME_CONFIG.minMultiplier}
                                >
                                    {state.isPlaying ? "Cash Out" : "Start Game"}
                                </Button>

                                <Tooltip content="Add funds">
                                    <Button
                                        color="success"
                                        variant="flat"
                                        isIconOnly
                                        onPress={() => {
                                            setState((prev) => ({ ...prev, balance: prev.balance + 1000 }));
                                        }}
                                        isDisabled={state.isPlaying}
                                    >
                                        <Icon icon="lucide:wallet" />
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>

                    {/* Game history - Fixed payout calculation and coloring */}
                    <div>
                        <h2 className="mb-2 text-lg font-semibold">Game History</h2>
                        <div className="bg-content2 max-h-40 overflow-y-auto rounded-lg p-4">
                            {state.gameHistory.length === 0 ? (
                                <p className="text-default-500 text-center">No games played yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {state.gameHistory.map((game, index) => {
                                        // Calculate the exact payout with proper rounding
                                        const payout = calculatePayout(game.bet, game.multiplier);

                                        return (
                                            <div
                                                key={index}
                                                className={`flex items-center justify-between rounded-md p-2 ${getHistoryItemColor(game)}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Icon
                                                        icon={
                                                            game.win
                                                                ? game.multiplier >= 1
                                                                    ? "lucide:check-circle"
                                                                    : "lucide:alert-circle"
                                                                : "lucide:x-circle"
                                                        }
                                                        className={getHistoryTextColor(game)}
                                                    />
                                                    <span>{formatCurrency(game.bet)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>{formatMultiplier(game.multiplier)}</span>
                                                    <span className={getHistoryTextColor(game)}>
                                                        {game.win ? `+${formatCurrency(payout)}` : "-"}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Game info - Simplified */}
                    <div className="text-default-500 mt-2 text-sm">
                        <p>Place your bet and try to cash out before the multiplier burns!</p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
