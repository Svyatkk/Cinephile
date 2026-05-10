export interface ISeat {
    id?: number;
    hall_id: number;
    row_num: number;
    seat_num: number;
    seat_type: string;
    is_purchased: number;
    is_locked: number;
}