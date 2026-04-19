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
    }
};
