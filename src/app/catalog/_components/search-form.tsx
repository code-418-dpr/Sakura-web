"use client";

import React, { useState } from "react";

import {
    Button,
    Checkbox,
    DateRangePicker,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Form,
    Input,
    NumberInput,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { Selection } from "@react-types/shared";

interface AwardItem {
    key: string;
    name: string;
}

const AWARDS: AwardItem[] = [
    { key: "DEFAULT", name: "Любой" },
    { key: "MONEY", name: "Денежный приз" },
    { key: "BONUS", name: "Бонусные баллы" },
    { key: "PRODUCT", name: "Товары" },
];
export function SearchForm() {
    const [query, setQuery] = useState("");
    const [selectedAward, setSelectedAward] = React.useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setIsLoading(false);
    };

    const renderDropdown = (
        label: string,
        items: AwardItem[],
        selectedKey: string | undefined,
        onSelectionChange: (keys: Selection) => void,
        allowEmpty = false,
    ) => {
        const selectedName = items.find((i) => i.key === selectedKey)?.name ?? AWARDS[0].name;
        if (selectedName === "Любой") selectedKey = AWARDS[0].key;

        return (
            <div className="mb-4">
                <label className="mb-2 block translate-x-2 text-sm font-medium">{label}</label>
                <Dropdown className="w-full">
                    <DropdownTrigger>
                        <Button variant="bordered" className="w-full justify-between text-left">
                            {selectedName}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection={!allowEmpty}
                        selectionMode="single"
                        selectedKeys={selectedKey ? new Set([selectedKey]) : new Set()}
                        onSelectionChange={onSelectionChange}
                    >
                        {items.map((item) => (
                            <DropdownItem key={item.key}>{item.name}</DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    };
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
                    <label className="mb-2 block translate-x-2 text-sm font-medium">Интервал проведения</label>
                    <DateRangePicker className="w-full" />
                </div>
                {renderDropdown(
                    "Призовой фонд",
                    AWARDS,
                    selectedAward,
                    (keys: Selection) => {
                        const selectedKey = Array.from(keys)[0] as string | undefined;
                        setSelectedAward(selectedKey);
                    },
                    false,
                )}
                <div>
                    <p className="translate-x-2 text-sm font-medium">Стоимость</p>
                    <div className="mt-4 flex flex-row gap-4">
                        <NumberInput className="" placeholder="Минимальная" defaultValue={0} />
                        <p className="flex items-center text-2xl font-bold">-</p>
                        <NumberInput className="" placeholder="Максимальная" defaultValue={100000} />
                    </div>
                </div>
                <Checkbox defaultSelected className="translate-x-2">
                    VIP
                </Checkbox>
            </div>

            <div className="mt-6 flex justify-end gap-2">
                <Button variant="flat" type="reset" className="mr-auto">
                    Сбросить
                </Button>
                <Button type="submit" isLoading={isLoading} startContent={<Icon icon="iconoir:search" />}>
                    Поиск
                </Button>
            </div>
        </Form>
    );
}
