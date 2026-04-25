export interface ICinema {
    id: number;
    name: string;
    city_id: number;
    address: string;
}

export interface ICity {
    id: number;
    name: string;
    cinemas?: ICinema[];
}

export interface IHall {
    id: number;
    cinema_id: number;
    name: string;
    technologies: string;
}

