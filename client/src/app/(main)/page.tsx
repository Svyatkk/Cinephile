"use client";

import { useEffect, useState } from "react";
import styles from './page.module.css'
import MainSwiper from "@/components/MainSwiper/MainSwiper";
import { Main } from "next/document";
import { IMovie } from "@/types/movie.interface";
import { movieService } from "@/api/movie.service";
export default function Home() {

    const [movies, setMovies] = useState<IMovie[] | null>()

    useEffect(() => {
        movieService.getAll()
            .then(res => setMovies(res))
            .catch(err => console.log(err))

    }, [])

    return (
        <div className={styles.pageMain}>

            <MainSwiper movies={movies}></MainSwiper>

        </div>
    );
}