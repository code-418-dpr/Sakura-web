import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
}
export function formatDatetime(datetime: Date) {
    const day = String(datetime.getDate()).padStart(2, "0");
    const month = String(datetime.getMonth() + 1).padStart(2, "0");
    const year = datetime.getFullYear();

    const hours = String(datetime.getHours()).padStart(2, "0");
    const minutes = String(datetime.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year}, ${hours}:${minutes}`;
}
