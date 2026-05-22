import { fetchOptions, BASE_URL } from "./config"
import { IUser } from "@/types/user.interface";
export const userService = {

    async auth(payload: IUser) {
        const response = await fetch(`${BASE_URL}/auth`, {
            method: "POST",
            ...fetchOptions,
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Помилка від бекенду:', errorText);
            throw new Error(response.status === 400 || response.status === 401 ? 'Неправильний логін або пароль' : `Помилка запиту: ${response.status}`);
        }

        return response.json()

    },

    async getCurrentUser() {
        const response = await fetch(`${BASE_URL}/auth`, {
            method: "GET",
            ...fetchOptions
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.success ? data.user : null;
    },

    async logout() {
        const response = await fetch(`${BASE_URL}/auth`, {
            method: "DELETE",
            ...fetchOptions
        });

        if (!response.ok) {
            throw new Error('Помилка при виході');
        }

        return response.json();
    }

}