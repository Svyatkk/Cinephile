"use client";

import { useEffect, useState } from "react";
import styles from './page.module.css'
import MainSwiper from "@/components/MainSwiper/MainSwiper";
import { IMovie } from "@/types/movie.interface";
import { movieService } from "@/api/movie.service";
import { ICinema, ICity } from "@/types/cinema.interface";

export default function Home() {
    const [movies, setMovies] = useState<IMovie[] | null>(null);
    const [chosenCity, setChosenCity] = useState<ICity | null>(null);
    const [chosenCinema, setChosenCinema] = useState<ICinema | null>(null);

    const loadContext = () => {
        const storedCity = localStorage.getItem('chosenCity');
        const storedCinema = localStorage.getItem('chosenCinema');
        const city = storedCity ? JSON.parse(storedCity) as ICity : null;
        const cinema = storedCinema ? JSON.parse(storedCinema) as ICinema : null;
        setChosenCity(city);
        setChosenCinema(cinema);
        return { cityId: city?.id, cinemaId: cinema?.id };
    };

    const fetchMovies = () => {
        const { cinemaId } = loadContext();
        movieService.getAll(cinemaId)
            .then(res => setMovies(res))
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchMovies();
        window.addEventListener('cinemaChanged', fetchMovies);
        return () => window.removeEventListener('cinemaChanged', fetchMovies);
    }, []);

    return (
        <div className={styles.pageMain}>
            <MainSwiper
                movies={movies}
                cityId={chosenCity?.id}
                cinemaId={chosenCinema?.id}
            />
        </div>
    );
}