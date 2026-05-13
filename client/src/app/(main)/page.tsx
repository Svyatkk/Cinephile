"use client";

import { useEffect, useState } from "react";
import styles from './page.module.css'
import MainSwiper from "@/components/MainSwiper/MainSwiper";
import { Main } from "next/document";
import { IMovie } from "@/types/movie.interface";
import { movieService } from "@/api/movie.service";
export default function Home() {

    const [movies, setMovies] = useState<IMovie[] | null>()

    const fetchMovies = () => {
        const storedCinema = localStorage.getItem('chosenCinema');
        let cinemaId: number | undefined = undefined;
        if (storedCinema) {
            try {
                cinemaId = JSON.parse(storedCinema).id;
            } catch (e) { }
        }

        movieService.getAll(cinemaId)
            .then(res => setMovies(res))
            .catch(err => console.log(err))
    };

    useEffect(() => {
        fetchMovies();

        window.addEventListener('cinemaChanged', fetchMovies);
        return () => window.removeEventListener('cinemaChanged', fetchMovies);
    }, [])

    return (
        <div className={styles.pageMain}>

            <MainSwiper movies={movies}></MainSwiper>
        </div>
    );
}