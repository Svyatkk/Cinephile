import { fetchOptions, BASE_URL } from "./config"
import { IUser } from "@/types/user.interface";
import { IMovie } from "@/types/movie.interface";


export const movieService = {

    async create(payload: IMovie) {
        const response = await fetch(`${BASE_URL}/movies`, {
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
    },
    async getAll() {
        const response = await fetch(`${BASE_URL}/movies`, {
            method: "GET",
            ...fetchOptions,
        })
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Помилка від бекенду:', errorText);
            throw new Error(`Помилка запиту: ${response.status}`);
        }


        return response.json()
    },
    async getById(id: string) {
        const response = await fetch(`${BASE_URL}/movies?id=${id}`, {
            ...fetchOptions,
        })
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Помилка від бекенду:', errorText);
            throw new Error(`Помилка запиту: ${response.status}`);
        }
        return response.json()
    },
    async getByName(name: string) {
        const response = await fetch(`${BASE_URL}/movies?name=${name}`, {
            ...fetchOptions,
        })
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Помилка від бекенду:', errorText);
            throw new Error(`Помилка запиту: ${response.status}`);
        }
        return response.json()

    },

    async getSessionsMovie(name: string) {

        const response = await fetch(`${BASE_URL}/getSessionsMovie/movie?name=${name}`, {
            ...fetchOptions,
        })
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Помилка від бекенду:', errorText);
            throw new Error(`Помилка запиту: ${response.status}`);
        }


        return response.json()
    }

}