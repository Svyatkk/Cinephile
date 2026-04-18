import { fetchOptions, BASE_URL } from "./config";
import { ISession } from "@/types/session.interface";

export const sessionService = {
    async create(payload: ISession) {
        const response = await fetch(`${BASE_URL}/sessions`, {
            method: "POST",
            ...fetchOptions,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.json();
            throw new Error(errorText.message || `Помилка запиту: ${response.status}`);
        }

        return response.json();
    }
};
