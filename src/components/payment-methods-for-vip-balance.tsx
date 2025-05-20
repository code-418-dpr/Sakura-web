"use client";

import { useState } from "react";

import { useSession } from "next-auth/react";

import { updateUser, updateUserVip } from "@/data/user";
import { useAuth } from "@/hooks/use-auth";
import { Alert, Button, Input } from "@heroui/react";

interface PaymentFormProps {
    onClose: () => void;
    isBalance?: boolean;
}

export default function PaymentFormForVIPorBalance({ onClose, isBalance = false }: PaymentFormProps) {
    const { update } = useSession();
    const [cardDetails, setCardDetails] = useState({
        number: "",
        expiry: "",
        cvc: "",
    });
    const [amount, setAmount] = useState("");
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const VIP_PRICE = 1700;
    const VIP_DAYS = 30;

    const isCardValid = Boolean(cardDetails.number.trim() && cardDetails.expiry.trim() && cardDetails.cvc.trim());

    const isAmountValid = !isBalance || (Number(amount) > 0 && !isNaN(Number(amount)));

    const handleSubmit = async () => {
        try {
            if (!user?.id) {
                throw new Error("Пользователь не найден");
            }

            if (isBalance) {
                const sum = Number(amount);
                if (sum <= 0 || isNaN(sum)) {
                    throw new Error("Неверная сумма пополнения");
                }

                await updateUser(user.id, Number(user.realBalance) + sum, Number(user.virtualBalance));
            } else {
                await updateUserVip(user.id, VIP_DAYS);
            }

            await update();
            setSuccess(true);
            setTimeout(onClose, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка оплаты");
        }
    };

    return (
        <div className="space-y-4">
            {success && <Alert color="success" title="Оплата прошла успешно!" />}
            {error && <Alert color="danger" title={error} />}

            <div className="text-xl font-bold">{isBalance ? "Пополнение баланса" : "Оплата VIP статуса"}</div>

            {isBalance && (
                <Input
                    label="Сумма пополнения"
                    placeholder="Введите сумму"
                    type="number"
                    value={amount}
                    onChange={(e) => {
                        setAmount(e.target.value);
                    }}
                    endContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">₽</span>
                        </div>
                    }
                />
            )}

            {!isBalance && (
                <div className="text-lg">
                    Стоимость: {VIP_PRICE} ₽
                    <span className="text-default-500 ml-2">(VIP статус на {VIP_DAYS} дней)</span>
                </div>
            )}

            <div className="space-y-2">
                <Input
                    label="Номер карты"
                    placeholder="0000 0000 0000 0000"
                    value={cardDetails.number}
                    onChange={(e) => {
                        setCardDetails({ ...cardDetails, number: e.target.value });
                    }}
                />
                <div className="flex gap-2">
                    <Input
                        label="Срок действия"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => {
                            setCardDetails({ ...cardDetails, expiry: e.target.value });
                        }}
                    />
                    <Input
                        label="CVC"
                        placeholder="123"
                        value={cardDetails.cvc}
                        onChange={(e) => {
                            setCardDetails({ ...cardDetails, cvc: e.target.value });
                        }}
                    />
                </div>
            </div>

            <Button
                color="success"
                fullWidth
                onPress={() => {
                    void handleSubmit();
                }}
                isDisabled={!isCardValid || !isAmountValid}
            >
                {isBalance ? "Пополнить баланс" : "Подтвердить оплату"}
            </Button>
        </div>
    );
}
