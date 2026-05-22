'use client'

import { useEffect, useState } from 'react'
import { movieService } from '@/api/movie.service'
import { sessionService } from '@/api/session.service'
import { IMovie } from '@/types/movie.interface'
import { PAGES_URL } from '@/api/config'
import Link from 'next/link'
import styles from './style.module.css'

type Props = {
    currentMovieId?: number
}

export default function RelatedMovies({ currentMovieId }: Props) {
    const [watchAlso, setWatchAlso] = useState<IMovie[]>([])
    const [soonInCinemas, setSoonInCinemas] = useState<IMovie[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAndClassifyMovies = async () => {
            try {
                setLoading(true)

                const storedCinema = typeof window !== 'undefined'
                    ? localStorage.getItem('chosenCinema')
                    : null
                const chosenCinemaId: number | null = storedCinema
                    ? (JSON.parse(storedCinema) as { id: number }).id
                    : null

                const allMovies: IMovie[] = await movieService.getAll()
                const filteredMovies = allMovies.filter(m => Number(m.id) !== currentMovieId)

                const classifiedMovies = await Promise.all(
                    filteredMovies.map(async (movie) => {
                        try {
                            let sessions = await sessionService.getByMovieId(Number(movie.id))

                            if (chosenCinemaId) {
                                sessions = sessions.filter(s => Number(s.cinema_id) === chosenCinemaId)
                            }

                            const now = new Date()
                            const futureSessions = sessions
                                .filter(s => new Date(s.start_time) > now)
                                .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

                            if (chosenCinemaId && futureSessions.length === 0) {
                                return null
                            }

                            const closestSession = futureSessions.length > 0 ? futureSessions[0] : null
                            const isSoon = closestSession
                                ? (new Date(closestSession.start_time).getTime() - now.getTime()) > 7 * 24 * 60 * 60 * 1000
                                : true

                            return { movie, isSoon }
                        } catch (err) {
                            return null
                        }
                    })
                )

                const watchList: IMovie[] = []
                const soonList: IMovie[] = []

                classifiedMovies.forEach((item) => {
                    if (!item) return
                    if (item.isSoon) {
                        soonList.push(item.movie)
                    } else {
                        watchList.push(item.movie)
                    }
                })

                setWatchAlso(watchList)
                setSoonInCinemas(soonList)
            } catch (error) {
                console.error('Error loading related movies:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchAndClassifyMovies()
    }, [currentMovieId])

    const getPosterUrl = (poster?: string) => {
        if (!poster) return null
        return poster.startsWith('http')
            ? poster
            : `http://localhost/api/${poster.startsWith('/') ? poster.slice(1) : poster}`
    }

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <span className={styles.spinner}>🎬</span> Завантаження схожих фільмів...
            </div>
        )
    }

    if (watchAlso.length === 0 && soonInCinemas.length === 0) {
        return null
    }

    return (
        <div className={styles.container}>
            {watchAlso.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Дивіться також:</h2>
                    <div className={styles.grid}>
                        {watchAlso.map(movie => {
                            const posterUrl = getPosterUrl(movie.poster_url)
                            return (
                                <Link
                                    href={PAGES_URL.MOVIE(Number(movie.id))}
                                    key={movie.id}
                                    className={styles.movieCard}
                                >
                                    <div className={styles.posterWrap}>
                                        {posterUrl ? (
                                            <img src={posterUrl} alt={movie.title} className={styles.poster} />
                                        ) : (
                                            <div className={styles.posterPlaceholder}>🎬</div>
                                        )}
                                    </div>
                                    <h4 className={styles.movieTitle}>{movie.title}</h4>
                                </Link>
                            )
                        })}
                    </div>
                </section>
            )}


            {soonInCinemas.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Скоро у прокаті:</h2>
                    <div className={styles.grid}>
                        {soonInCinemas.map(movie => {
                            const posterUrl = getPosterUrl(movie.poster_url)
                            return (
                                <Link
                                    href={PAGES_URL.MOVIE(Number(movie.id))}
                                    key={movie.id}
                                    className={styles.movieCard}
                                >
                                    <div className={styles.posterWrap}>
                                        {posterUrl ? (
                                            <img src={posterUrl} alt={movie.title} className={styles.poster} />
                                        ) : (
                                            <div className={styles.posterPlaceholder}>🎬</div>
                                        )}
                                        <div className={styles.soonBadge}>Скоро</div>
                                    </div>
                                    <h4 className={styles.movieTitle}>{movie.title}</h4>
                                </Link>
                            )
                        })}
                    </div>
                </section>
            )}
        </div>
    )
}
