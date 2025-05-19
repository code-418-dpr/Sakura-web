"use client";

import React, { useState } from "react";

import { SearchLotteriesParams } from "@/types/lottery-item";
import {
    Button,
    Checkbox,
    DateRangePicker,
    DateValue,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Form,
    Input,
    NumberInput,
} from "@heroui/react";
import type { RangeValue, Selection } from "@react-types/shared";

interface AwardItem {
    key: string;
    name: string;
}

const AWARDS: AwardItem[] = [
    { key: "MONEY", name: "Денежный приз" },
    { key: "BONUS", name: "Бонусные баллы" },
    { key: "PRODUCT", name: "Товары" },
];

interface SearchFormProps {
    onSubmit: (params: SearchLotteriesParams) => void;
}
export function SearchForm({ onSubmit }: SearchFormProps) {
    const [query, setQuery] = useState("");
    const [selectedAward, setSelectedAward] = useState<string>();
    const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
    const [isVip, setIsVip] = useState(false);
    const [minTicketPrice, setMinTicketPrice] = useState<number>();
    const [maxTicketPrice, setMaxTicketPrice] = useState<number>();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const params: SearchLotteriesParams = {
            query: query || undefined,
            prizeType: selectedAward as "MONEY" | "POINTS" | "PRODUCTS" | undefined,
            start: dateRange.start,
            end: dateRange.end,
            isVip: isVip || undefined,
            minTicketPrice,
            maxTicketPrice,
        };

        onSubmit(params);
        setIsLoading(false);
    };

    const handleReset = () => {
        setQuery("");
        setSelectedAward(undefined);
        setDateRange({});
        setIsVip(false);
        setMinTicketPrice(undefined);
        setMaxTicketPrice(undefined);
    };

    const renderDropdown = (
        label: string,
        items: AwardItem[],
        selectedKey: string | undefined,
        onSelectionChange: (keys: Selection) => void,
        allowEmpty = false,
    ) => {
        const selectedName = items.find((i) => i.key === selectedKey)?.name ?? "Выберите...";

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

    const handleDateChange = (newRange: RangeValue<DateValue> | null) => {
        if (newRange?.start) {
            setDateRange({
                start: new Date(newRange.start.year, newRange.start.month - 1, newRange.start.day),
                end: new Date(newRange.end.year, newRange.end.month - 1, newRange.end.day),
            });
        } else {
            setDateRange({});
        }
    };

    return (
        <Form onSubmit={handleSubmit} onReset={handleReset}>
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
                    <DateRangePicker className="w-full" onChange={handleDateChange} />
                </div>
                {renderDropdown(
                    "Призовой фонд",
                    AWARDS,
                    selectedAward,
                    (keys: Selection) => {
                        const selectedKey = Array.from(keys)[0] as string | undefined;
                        setSelectedAward(selectedKey);
                    },
                    true,
                )}
                <div>
                    <p className="translate-x-2 text-sm font-medium">Стоимость</p>
                    <div className="mt-4 flex flex-row gap-4">
                        <NumberInput
                            className=""
                            placeholder="Минимальная"
                            defaultValue={0}
                            value={minTicketPrice}
                            onChange={(value) => {
                                setMinTicketPrice(Number(value));
                            }}
                        />
                        <p className="flex items-center text-2xl font-bold">-</p>
                        <NumberInput
                            className=""
                            placeholder="Максимальная"
                            defaultValue={100000}
                            value={maxTicketPrice}
                            onChange={(value) => {
                                setMaxTicketPrice(Number(value));
                            }}
                        />
                    </div>
                </div>
                <Checkbox isSelected={isVip} onValueChange={setIsVip} className="translate-x-2">
                    VIP
                </Checkbox>
            </div>

            <div className="mt-6 flex justify-end gap-2">
                <Button variant="flat" type="reset" className="mr-auto">
                    Сбросить
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    Поиск
                </Button>
            </div>
        </Form>
    );
}
