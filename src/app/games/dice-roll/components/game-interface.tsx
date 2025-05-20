import React from "react";

import { Button, Card, CardBody, Input, Radio, RadioGroup, Tab, Tabs } from "@heroui/react";
import { Icon } from "@iconify/react";

import { DiceRoll } from "./dice-roll";
import { useGame } from "./game-context";
import { GameHistory } from "./game-history";

export const GameInterface: React.FC = () => {
    const { state, placeBet, rollDice, updateBet, setMode, setGoal, resetGame } = useGame();
    const [selectedTab, setSelectedTab] = React.useState("play");

    const handlePlaceBet = () => {
        if (state.selectedMode === "Par") {
            // For Par-Impar mode, goal is 2 for even, 3 for odd
            placeBet(state.currentBet, state.selectedMode, state.goalNumber);
        } else {
            placeBet(state.currentBet, state.selectedMode, state.goalNumber);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => {
                    setSelectedTab(key as string);
                }}
                aria-label="Game options"
            >
                <Tab
                    key="play"
                    title={
                        <div className="flex items-center gap-2">
                            <Icon icon="lucide:gamepad-2" />
                            <span>Play</span>
                        </div>
                    }
                >
                    <Card>
                        <CardBody>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-lg font-semibold">Place Your Bet</h2>
                                    <div className="flex flex-col gap-4 md:flex-row">
                                        <Input
                                            type="number"
                                            label="Bet Amount"
                                            value={state.currentBet.toString()}
                                            onValueChange={updateBet}
                                            startContent={<Icon icon="lucide:coins" className="text-default-400" />}
                                            min={1}
                                            max={state.balance}
                                            className="md:max-w-[200px]"
                                        />

                                        <div className="flex flex-grow flex-col gap-2">
                                            <label className="text-sm font-medium">Game Mode</label>
                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    color={state.selectedMode === "HighLow" ? "primary" : "default"}
                                                    variant={state.selectedMode === "HighLow" ? "solid" : "flat"}
                                                    onPress={() => {
                                                        setMode("HighLow");
                                                    }}
                                                    startContent={<Icon icon="lucide:arrow-up-down" />}
                                                >
                                                    High & Low (×1.9)
                                                </Button>
                                                <Button
                                                    color={state.selectedMode === "Exact" ? "primary" : "default"}
                                                    variant={state.selectedMode === "Exact" ? "solid" : "flat"}
                                                    onPress={() => {
                                                        setMode("Exact");
                                                    }}
                                                    startContent={<Icon icon="lucide:target" />}
                                                >
                                                    Precisely (×7)
                                                </Button>
                                                <Button
                                                    color={state.selectedMode === "Par" ? "primary" : "default"}
                                                    variant={state.selectedMode === "Par" ? "solid" : "flat"}
                                                    onPress={() => {
                                                        setMode("Par");
                                                    }}
                                                    startContent={<Icon icon="lucide:divide" />}
                                                >
                                                    Par-Impar (×1.8)
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {state.selectedMode === "HighLow" && (
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-sm font-medium">Choose Your Number (2-12)</h3>
                                        <Input
                                            type="number"
                                            placeholder="Enter a number between 2 and 12"
                                            value={state.goalNumber?.toString() ?? ""}
                                            onValueChange={setGoal}
                                            min={2}
                                            max={12}
                                            className="max-w-[200px]"
                                        />
                                        <p className="text-default-500 text-sm">
                                            If you choose 2-6, you bet the sum will be HIGHER.
                                            <br />
                                            If you choose 7-12, you bet the sum will be LOWER.
                                        </p>
                                    </div>
                                )}

                                {state.selectedMode === "Exact" && (
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-sm font-medium">Predict Exact Sum (2-12)</h3>
                                        <Input
                                            type="number"
                                            placeholder="Enter a number between 2 and 12"
                                            value={state.goalNumber?.toString() ?? ""}
                                            onValueChange={setGoal}
                                            min={2}
                                            max={12}
                                            className="max-w-[200px]"
                                        />
                                    </div>
                                )}

                                {state.selectedMode === "Par" && (
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-sm font-medium">Choose Even or Odd</h3>
                                        <RadioGroup
                                            value={state.goalNumber?.toString() ?? "2"}
                                            onValueChange={(value) => {
                                                setGoal(value);
                                            }}
                                            orientation="horizontal"
                                        >
                                            <Radio value="2">Even</Radio>
                                            <Radio value="3">Odd</Radio>
                                        </RadioGroup>
                                    </div>
                                )}

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            color="primary"
                                            onPress={handlePlaceBet}
                                            isDisabled={
                                                !state.selectedMode || state.currentRound !== null || state.isRolling
                                            }
                                            startContent={<Icon icon="lucide:check-circle" />}
                                        >
                                            Place Bet
                                        </Button>
                                        <Button
                                            color="success"
                                            onPress={rollDice}
                                            isDisabled={state.currentRound === null || state.isRolling}
                                            startContent={<Icon icon="lucide:dices" />}
                                            isLoading={state.isRolling}
                                        >
                                            Roll Dice
                                        </Button>
                                        <Button
                                            variant="flat"
                                            onPress={resetGame}
                                            isDisabled={state.isRolling}
                                            startContent={<Icon icon="lucide:refresh-ccw" />}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </div>

                                <DiceRoll />

                                <div className="bg-content2 rounded-lg p-4">
                                    <p className="text-default-700">{state.message}</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
                <Tab
                    key="history"
                    title={
                        <div className="flex items-center gap-2">
                            <Icon icon="lucide:history" />
                            <span>History</span>
                        </div>
                    }
                >
                    <GameHistory />
                </Tab>
            </Tabs>
        </div>
    );
};
