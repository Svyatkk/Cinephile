"use client";

import { useEffect, useState } from "react";
import styles from './page.module.css'
import { useRouter } from "next/navigation";
import MainSwiper from "@/components/MainSwiper/MainSwiper";
import { Main } from "next/document";
import { IMovive } from "@/types/movie.interface";

export default function Home() {

    const [movies, setMovies] = useState<IMovive[] | null>()
    const route = useRouter()


    useEffect(() => {
        fetch('/api/index.php')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Помилка HTTP: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log("Отримані дані:", data);
                setMovies(data.data);
            })
            .catch(err => console.error("Помилка завантаження даних:", err));

    }, [])


    return (
        <div className={styles.pageMain}>

            <MainSwiper movies={movies}></MainSwiper>

        </div>
    );
}