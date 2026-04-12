'use client'
import styles from './style.module.css'
import { useEffect, useState } from "react"
import { movieService } from '@/api/movie.service'
import { IMovie } from '@/types/movie.interface'



type Props = {
    id: string
}


export default function MoviePage({ id }: Props) {



    const [movie, setMovie] = useState<IMovie | null>()

    useEffect(() => {
        movieService.getById(id)
            .then(res => setMovie(res))

    }, [])

    return (
        <>

            <div className={styles.block}>


                <div className={styles.poster}>

                </div>

                <div className={styles.side}>
                    <div className={styles.description}>
                        {movie?.original_title}
                    </div>

                    <div className={styles.seans}>

                    </div>
                </div>

            </div>

        </>
    )
}