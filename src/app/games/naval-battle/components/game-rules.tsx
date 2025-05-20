import React from "react";

import { Accordion, AccordionItem, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

export const GameRules: React.FC = () => {
    return (
        <Card className="bg-content1">
            <CardBody>
                <Accordion>
                    <AccordionItem
                        key="1"
                        aria-label="Game Rules"
                        title="Game Rules"
                        startContent={<Icon icon="lucide:book" className="text-primary" />}
                    >
                        <div className="px-2 py-1 text-sm">
                            <p className="mb-2">
                                <strong>Naval Battle Lottery</strong> is a game where two players compete on 10×10
                                grids.
                            </p>

                            <h3 className="mt-3 mb-1 font-semibold">The Board:</h3>
                            <p>Each player has two 10×10 grids:</p>
                            <ul className="mb-2 list-disc pl-5">
                                <li>One for your fleet</li>
                                <li>One to track shots at the enemy</li>
                            </ul>
                            <p>
                                The horizontal lines are labeled A-K (excluding E and Y), and vertical lines are
                                numbered 1-10.
                            </p>

                            <h3 className="mt-3 mb-1 font-semibold">Fleet Composition:</h3>
                            <p>Each player&apos;s fleet consists of 10 ships:</p>
                            <ul className="mb-2 list-disc pl-5">
                                <li>1 four-deck ship</li>
                                <li>2 three-deck ships</li>
                                <li>3 two-deck ships</li>
                                <li>4 single-deck ships</li>
                            </ul>
                            <p>
                                Ships are placed horizontally or vertically, without touching each other on sides or
                                corners.
                            </p>

                            <h3 className="mt-3 mb-1 font-semibold">Ship Placement:</h3>
                            <ul className="mb-2 list-disc pl-5">
                                <li>You can choose between random or manual ship placement</li>
                                <li>In manual mode, place ships by clicking on the board</li>
                                <li>Use the &quot;Rotate Ship&quot; button to change orientation</li>
                                <li>Ships cannot touch each other, even diagonally</li>
                            </ul>

                            <h3 className="mt-3 mb-1 font-semibold">Gameplay:</h3>
                            <ul className="mb-2 list-disc pl-5">
                                <li>Players take turns choosing coordinates on the opponent&apos;s grid</li>
                                <li>If a shot hits an empty square: &quot;Past&quot; – turn passes to opponent</li>
                                <li>
                                    If a shot hits but doesn&apos;t sink a ship: &quot;Wounded&quot; – player gets
                                    another turn
                                </li>
                                <li>If a shot sinks a ship: &quot;Killed&quot; – player gets another turn</li>
                                <li>The bot will play automatically during its turn</li>
                            </ul>

                            <h3 className="mt-3 mb-1 font-semibold">Winning:</h3>
                            <p>The first player to sink all enemy ships wins and takes all the winnings in the pot.</p>
                        </div>
                    </AccordionItem>
                </Accordion>
            </CardBody>
        </Card>
    );
};
