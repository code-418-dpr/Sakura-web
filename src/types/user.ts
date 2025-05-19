export interface User {
    id: string;
    userName: string;
    email: string;
    phone: string;
    firstName: string;
    lastname: string;
    patronymic: string | null | undefined;
    isVip: boolean;
    permissions: string[];
}
