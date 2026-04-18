export interface ISession {
    id?: number;
    movie_id: number;
    hall_id: number;
    start_time: string;
    end_time: string;
    base_price: number;
    format: string;
    language_tag: string;
}
