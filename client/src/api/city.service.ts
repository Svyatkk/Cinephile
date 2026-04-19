import { fetchOptions, BASE_URL } from "./config";
import { ICity } from "@/types/cinema.interface";

export const cityService = {
    async getAll(): Promise<ICity[]> {
        const response = await fetch(`${BASE_URL}/city`, {
            method: "GET",
            ...fetchOptions
        });
        if (!response.ok) {
            throw new Error(`Помилка при отриманні міст: ${response.status}`);
        }
        return response.json();
    },
    async create(name: string) {
        const response = await fetch(`${BASE_URL}/city`, {
            method: "POST",
            ...fetchOptions,
            body: JSON.stringify({ name })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Помилка при створенні міста");
        }
        return response.json();
    }
};
