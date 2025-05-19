"use client";

import React, { useState } from "react";

import ModalOrDrawer from "@/components/modal-or-drawer";
import {
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
} from "@heroui/react";

export default function UsersTab() {
    const { isOpen, onOpenChange } = useDisclosure();
    const [selectedId] = useState<string | null>(null);
    const totalPages = 1;
    const currentPage = 1;

    /*
    const handleRowClick = (id: string) => {
        setSelectedId(id);
        onOpen();
    };*/
    return (
        <div className="mt-2">
            <div className="overflow-x-auto">
                <Table aria-label="Пользователи">
                    <TableHeader>
                        <TableColumn>ФИО</TableColumn>
                        <TableColumn>Является випом</TableColumn>
                        <TableColumn>Баланс</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"Данных пока нет"}>
                        <TableRow key={1}>
                            <TableCell>Якубенко Вадим Виталиевич</TableCell>
                            <TableCell>Да</TableCell>
                            <TableCell>900,00 ₽</TableCell>
                        </TableRow>
                        <TableRow key={2}>
                            <TableCell>Якубенко Вадим Виталиевич</TableCell>
                            <TableCell>Да</TableCell>
                            <TableCell>900,00 ₽</TableCell>
                        </TableRow>
                        <TableRow key={3}>
                            <TableCell>Якубенко Вадим Виталиевич</TableCell>
                            <TableCell>Да</TableCell>
                            <TableCell>900,00 ₽</TableCell>
                        </TableRow>
                        <TableRow key={4}>
                            <TableCell>Якубенко Вадим Виталиевич</TableCell>
                            <TableCell>Да</TableCell>
                            <TableCell>900,00 ₽</TableCell>
                        </TableRow>
                        <TableRow key={5}>
                            <TableCell>Якубенко Вадим Виталиевич</TableCell>
                            <TableCell>Да</TableCell>
                            <TableCell>900,00 ₽</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <Pagination
                total={totalPages}
                page={currentPage}
                //onChange={onPageChangeAction}
                className="mt-0 justify-items-center"
            />
            {selectedId && (
                <ModalOrDrawer isOpen={isOpen} onOpenChangeAction={onOpenChange} label="Детали представителя" size="xl">
                    <p>Ведётся разработка</p>
                </ModalOrDrawer>
            )}
        </div>
    );
}
