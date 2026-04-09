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




    return (
        <div className={styles.pageMain}>

            <MainSwiper movies={movies}></MainSwiper>

        </div>
    );
}