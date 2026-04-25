import { fetchOptions, BASE_URL } from "./config";
import { ICinema } from "@/types/cinema.interface";

export const cinemaService = {
    async getAll(): Promise<ICinema[]> {
        const response = await fetch(`${BASE_URL}/cinema`, {
            method: "GET",
            ...fetchOptions
        });
        if (!response.ok) {
            throw new Error(`Помилка при отриманні кінотеатрів: ${response.status}`);
        }
        return response.json();
    },
    async create(payload: Omit<ICinema, 'id'>) {
        const response = await fetch(`${BASE_URL}/cinema`, {
            method: "POST",
            ...fetchOptions,
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Помилка при створенні кінотеатру");
        }
        return response.json();
    },

};
