'use client'

import styles from './style.module.css'
import { IMovie } from '@/types/movie.interface'
import { useRouter } from 'next/navigation'
import { PAGES_URL, BASE_URL } from '@/api/config'

type Props = {
    movie: IMovie
}

export default function MovieBlock({ movie }: Props) {
    const route = useRouter()
    const poster = movie.poster_url;
    const fullImageUrl = poster?.startsWith('http')
        ? poster
        : `http://localhost/api/${poster?.startsWith('/') ? poster.slice(1) : poster}`;

    return (
        <div className={styles.block} style={{
            backgroundImage: `url("${fullImageUrl}")`
        }}
        >
            <h3 onClick={() => { route.push(PAGES_URL.MOVIE(movie?.id)) }} style={{ cursor: 'pointer' }}>
                {movie.title}
            </h3>

        </div>
    )
}