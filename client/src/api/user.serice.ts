import { fetchOptions, BASE_URL } from "./config"

export const userService = {

    async auth(payload: any) {

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