import { fetchOptions, BASE_URL } from "./config";
import { IOrder } from "@/types/order.interface";

export const orderService = {
    async lockSeats(payload: { user_id: number, session_id: number, seat_ids: number[] }): Promise<{ message: string }> {
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

    async createOrder(payload: { user_id: number, session_id: number, seat_ids: number[], total_amount: number }): Promise<{ message: string, order_id?: number }> {
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

    async getOrders(userId: number): Promise<IOrder[]> {
        const response = await fetch(`${BASE_URL}/orders?user_id=${userId}`, {
            method: "GET",
            ...fetchOptions
        });
        if (!response.ok) {
            throw new Error(`Помилка при отриманні замовлень: ${response.status}`);
        }
        return response.json();
    },

    async cancelOrder(orderId: number, userId: number): Promise<{ message: string }> {
        const response = await fetch(`${BASE_URL}/orders`, {
            method: "DELETE",
            ...fetchOptions,
            body: JSON.stringify({ order_id: orderId, user_id: userId })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Помилка при скасуванні замовлення");
        }
        return response.json();
    }
};
