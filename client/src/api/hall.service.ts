import { fetchOptions, BASE_URL } from "./config";
import { IHall } from "@/types/cinema.interface";

export const hallService = {
    async getAll(): Promise<IHall[]> {
        const response = await fetch(`${BASE_URL}/halls`, {
            method: "GET",
            ...fetchOptions
        });
        if (!response.ok) {
            throw new Error(`Помилка при отриманні залів: ${response.status}`);
        }
        return response.json();
    },
    async create(payload: { cinema_id: number, name: string, technologies: string, rows_count: number, seats_per_row: number }) {
        const response = await fetch(`${BASE_URL}/halls`, {
            method: "POST",
            ...fetchOptions,
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Помилка при створенні залу");
        }
        return response.json();
    }
};
