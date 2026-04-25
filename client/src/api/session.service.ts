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
    },

    async getByMovieId(movieId: number): Promise<ISession[]> {
        const response = await fetch(`${BASE_URL}/sessions?movie_id=${movieId}`, {
            method: "GET",
            ...fetchOptions
        });

        if (!response.ok) {
            throw new Error(`Помилка при отриманні сеансів: ${response.status}`);
        }

        return response.json();
    }

};
