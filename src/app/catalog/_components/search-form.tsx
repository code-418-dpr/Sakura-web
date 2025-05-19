"use client";

import React, { useState } from "react";

import { Button, DateRangePicker, Form, Input } from "@heroui/react";

export function SearchForm() {
    const [query, setQuery] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setIsLoading(false);
    };

    // const renderDropdown = (
    //     label: string,
    //     items: { key: string; name: string }[],
    //     selectedKey: string | undefined,
    //     onSelectionChange: (keys: Selection) => void,
    //     allowEmpty = false,
    // ) => {
    //     const selectedName = items.find((i) => i.key === selectedKey)?.name ?? "Выберите...";

    //     return (
    //         <div className="mb-4">
    //             <label className="mb-2 block text-sm font-medium">{label}</label>
    //             <Dropdown className="w-full">
    //                 <DropdownTrigger>
    //                     <Button variant="bordered" className="w-full justify-between text-left">
    //                         {selectedName}
    //                     </Button>
    //                 </DropdownTrigger>
    //                 <DropdownMenu
    //                     disallowEmptySelection={!allowEmpty}
    //                     selectionMode="single"
    //                     selectedKeys={selectedKey ? new Set([selectedKey]) : new Set()}
    //                     onSelectionChange={onSelectionChange}
    //                 >
    //                     {items.map((item) => (
    //                         <DropdownItem key={item.key}>{item.name}</DropdownItem>
    //                     ))}
    //                 </DropdownMenu>
    //             </Dropdown>
    //         </div>
    //     );
    // };

    return (
        <Form onSubmit={handleSubmit}>
            <div className="grid w-full grid-cols-1 gap-4">
                <div className="col-span-full">
                    <Input
                        label="Название / описание"
                        variant="bordered"
                        fullWidth
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                        }}
                    />
                </div>

                <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">Интервал подачи</label>
                    <DateRangePicker className="w-full" />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="flat">Сбросить</Button>
                <Button type="submit" isLoading={isLoading}>
                    Поиск
                </Button>
            </div>
        </Form>
    );
}
