export interface ITicket {
    id: number;
    order_id: number;
    seat_id: number;
    barcode: string;
    price: number;
    
    // Joined fields from DB
    movie_title: string;
    cinema_name: string;
    hall_name: string;
    start_time: string;
    row_num: number;
    seat_num: number;
}

export interface IOrder {
    id: number;
    user_id: number;
    total_amount: number;
    status: string;
    created_at: string;
    
    // Relations
    tickets?: ITicket[];
}
