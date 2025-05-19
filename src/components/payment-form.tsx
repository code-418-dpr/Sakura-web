import { useState } from "react";

import { useSession } from "next-auth/react";

import { updateUser } from "@/data/user";
import { useAuth } from "@/hooks/use-auth";
import { Alert, Button, Input, Radio, RadioGroup } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface PaymentFormProps {
    onClose: () => void;
    ticketPrice: number;
}

export default function PaymentForm({ onClose, ticketPrice }: PaymentFormProps) {
    const { update } = useSession();
    const [paymentMethod, setPaymentMethod] = useState<"real" | "card" | "bonuses">("real");
    const [cardDetails, setCardDetails] = useState({
        number: "",
        expiry: "",
        cvc: "",
    });
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const calculatePrice = () => {
        return paymentMethod === "bonuses" ? ticketPrice * 1.1 : ticketPrice;
    };
    const isCardValid = Boolean(cardDetails.number.trim() && cardDetails.expiry.trim() && cardDetails.cvc.trim());

    const isSubmitDisabled =
        (paymentMethod === "card" && !isCardValid) ||
        (paymentMethod === "bonuses" && Number(user?.virtualBalance ?? 0) < calculatePrice()) ||
        (paymentMethod === "real" && Number(user?.realBalance ?? 0) < calculatePrice());

    const handleSubmit = async () => {
        try {
            const price = calculatePrice();

            if (paymentMethod === "real") {
                if (Number(user?.realBalance ?? 0) < price) {
                    throw new Error("Недостаточно средств на балансе");
                }
            } else if (paymentMethod === "bonuses") {
                if (Number(user?.virtualBalance ?? 0) < price) {
                    throw new Error("Недостаточно бонусных баллов");
                }
            }

            if (!user?.id) {
                setError("Пользователь не найден");
                return;
            }
            if (paymentMethod === "real") {
                await updateUser(user.id, Number(user.realBalance) - price, Number(user.virtualBalance) + price * 0.1);
            } else if (paymentMethod === "bonuses") {
                await updateUser(user.id, Number(user.realBalance), Number(user.virtualBalance) - price);
            } else {
                await updateUser(user.id, Number(user.realBalance), Number(user.virtualBalance) + price * 0.1);
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

            <div className="text-xl font-bold">
                Итого к оплате: {calculatePrice().toFixed(2)}{" "}
                {paymentMethod === "bonuses" ? (
                    <span className="text-md inline-block align-middle">
                        <Icon icon="iconoir:leaf" width="20" height="20" />
                    </span>
                ) : (
                    "₽"
                )}
            </div>
            <RadioGroup
                label="Способ оплаты"
                value={paymentMethod}
                onValueChange={(value) => {
                    setPaymentMethod(value as "real" | "card" | "bonuses");
                }}
            >
                <Radio value="real">Внутренний счёт</Radio>
                <Radio value="bonuses">Оплата бонусами</Radio>
                <Radio value="card">Банковская карта</Radio>
            </RadioGroup>

            {paymentMethod === "card" && (
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
            )}

            <Button
                color="success"
                fullWidth
                onPress={() => {
                    void handleSubmit();
                }}
                isDisabled={paymentMethod === "card" ? isSubmitDisabled : false}
            >
                Подтвердить оплату
            </Button>
        </div>
    );
}
