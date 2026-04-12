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
            throw new Error(`Помилка запиту: ${response.status}`);
        }

        return response.json()

    }

}