import { fetchOptions, BASE_URL } from "./config";
import { IOrder } from "@/types/order.interface";

export const orderService = {
    async lockSeats(payload: { session_id: number, seat_ids: number[] }): Promise<{ message: string }> {
        const response = await fetch(`${BASE_URL}/cart_locks`, {
            method: "POST",
            ...fetchOptions,
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Помилка при бронюванні місць");
        }
        return response.json();
    },


    async createOrder(payload: { session_id: number, seat_ids: number[], total_amount: number }): Promise<{ message: string, order_id?: number }> {
        const response = await fetch(`${BASE_URL}/orders`, {
            method: "POST",
            ...fetchOptions,
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Помилка при створенні замовлення");
        }
        return response.json();
    },

    async getOrders(): Promise<IOrder[]> {
        const response = await fetch(`${BASE_URL}/orders`, {
            method: "GET",
            ...fetchOptions
        });
        if (!response.ok) {
            throw new Error(`Помилка при отриманні замовлень: ${response.status}`);
        }
        return response.json();
    },

    async cancelOrder(orderId: number): Promise<{ message: string }> {
        const response = await fetch(`${BASE_URL}/orders`, {
            method: "DELETE",
            ...fetchOptions,
            body: JSON.stringify({ order_id: orderId })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Помилка при скасуванні замовлення");
        }
        return response.json();
    },
    async unlockSeats(sessionId: number): Promise<{ message: string }> {
        const response = await fetch(`${BASE_URL}/cart_locks`, {
            method: "DELETE",
            ...fetchOptions,
            body: JSON.stringify({ session_id: sessionId })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Помилка при скасуванні бронювання");
        }
        return response.json();
    },
};
