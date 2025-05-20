"use client";

import React, { useEffect, useState } from "react";

import { getUsers } from "@/data/user";
import { User } from "@/types/user";
import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function UsersTab() {
    const [page, setPage] = React.useState(1);
    const rowsPerPage = 8;
    const [users, setUsers] = useState<User[]>([]); // Указываем тип состояния

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getUsers();
                setUsers(usersData);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        void fetchUsers();
    }, []);

    const pages = Math.ceil(users.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return users.slice(start, end);
    }, [page, users]);

    return (
        <div className="mt-2">
            <div className="overflow-x-auto">
                <Table
                    aria-label="Пользователи"
                    bottomContent={
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="secondary"
                                page={page}
                                total={pages}
                                onChange={(page) => { setPage(page); }}
                            />
                        </div>
                    }
                    classNames={{
                        wrapper: "min-h-[222px]",
                    }}
                >
                    <TableHeader>
                        <TableColumn>Почта</TableColumn>
                        <TableColumn>Никнейм</TableColumn>
                        <TableColumn>Баланс реальный</TableColumn>
                        <TableColumn>Баланс виртуальный</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"Данных пока нет"} items={items}>
                        {(item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.realBalance} ₽</TableCell>
                                <TableCell>
                                    <div className="flex w-full items-baseline gap-1">
                                        <Icon icon="iconoir:leaf" width="16" height="16" />
                                        {item.virtualBalance}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
