import { ISeat } from "@/types/seat.interface";
import { fetchOptions, BASE_URL } from "./config";


export const seatService = {
    async getForSession(sessionId: number): Promise<ISeat[]> {
        const response = await fetch(`${BASE_URL}/seats?session_id=${sessionId}`, {
            method: "GET",
            ...fetchOptions
        });
        if (!response.ok) {
            throw new Error(`Помилка при отриманні місць: ${response.status}`);
        }
        return response.json();
    }
};


