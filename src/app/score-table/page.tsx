"use client";

import React, { useEffect, useState } from "react";

import { getSoreUsers } from "@/data/user";
import { User } from "@/types/user";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";

export default function ScoreTablePage() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getSoreUsers();
                setUsers(usersData);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };
        void fetchUsers();
    }, []);

    return (
        <div className="mt-2">
            <div className="overflow-x-auto">
                <Table aria-label="Пользователи" classNames={{ wrapper: "min-h-[222px]" }}>
                    <TableHeader>
                        <TableColumn>№</TableColumn>
                        <TableColumn>Почта</TableColumn>
                        <TableColumn>Никнейм</TableColumn>
                        <TableColumn>Счёт</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"Данных пока нет"}>
                        {users.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.score}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
