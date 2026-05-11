import { IHall } from "./cinema.interface";

export interface ISession {
    id?: number;
    movie_id: number;
    hall_id: number;
    start_time: string;
    end_time: string;
    base_price: number;
    format: string;
    language_tag: string;

    hall_name?: string;
    cinema_id?: number;
    cinema_name?: string;
    cinema_address?: string;
    city_id?: number;
    city_name?: string;
}
