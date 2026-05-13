'use client'
import { useEffect, useState, useMemo } from 'react'
import { sessionService } from '@/api/session.service'
import { ISession } from '@/types/session.interface'
import styles from './styles.module.css'
import { useRouter } from 'next/navigation'
import { PAGES_URL } from '@/api/config'

interface ICinemaStored {
    id: number
    name: string
}

function getPosterUrl(posterUrl?: string): string | null {
    if (!posterUrl) return null
    return posterUrl.startsWith('http')
        ? posterUrl
        : `http://localhost/api/${posterUrl.startsWith('/') ? posterUrl.slice(1) : posterUrl}`
}

function toDateKey(d: Date) {
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function getDateLabel(d: Date): { main: string; sub: string } {
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)

    if (toDateKey(d) === toDateKey(today)) {
        return { main: 'Сьогодні', sub: d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' }) }
    }
    if (toDateKey(d) === toDateKey(tomorrow)) {
        return { main: 'Завтра', sub: d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' }) }
    }
    return {
        main: d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' }),
        sub: d.toLocaleDateString('uk-UA', { weekday: 'long' })
    }
}

export default function SoonPage() {
    const router = useRouter()
    const [cinema, setCinema] = useState<ICinemaStored | null>(null)
    const [sessions, setSessions] = useState<ISession[]>([])
    const [loading, setLoading] = useState(true)

    const loadCinema = () => {
        const stored = localStorage.getItem('chosenCinema')
        if (stored) {
            setCinema(JSON.parse(stored))
        } else {
            setCinema(null)
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCinema()
        window.addEventListener('cinemaChanged', loadCinema)
        return () => window.removeEventListener('cinemaChanged', loadCinema)
    }, [])

    useEffect(() => {
        if (!cinema) return
        setLoading(true)
        sessionService.getByCinemaId(String(cinema.id))
            .then(data => {
                setSessions(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [cinema])

    const moviesByDate = useMemo(() => {
        const movieMap = new Map<number, ISession>()
        sessions.forEach(s => {
            const existing = movieMap.get(s.movie_id)
            if (!existing || new Date(s.start_time) < new Date(existing.start_time)) {
                movieMap.set(s.movie_id, s)
            }
        })

        const sorted = [...movieMap.values()].sort(
            (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        )

        const byDate = new Map<string, { label: { main: string; sub: string }; movies: ISession[] }>()
        sorted.forEach(s => {
            const d = new Date(s.start_time)
            const key = toDateKey(d)
            if (!byDate.has(key)) {
                byDate.set(key, { label: getDateLabel(d), movies: [] })
            }
            byDate.get(key)!.movies.push(s)
        })

        return [...byDate.entries()]
    }, [sessions])

    if (loading) {
        return <div className={styles.loading}>Завантаження...</div>
    }

    if (!cinema) {
        return (
            <div className={styles.noCinema}>
                <div className={styles.noCinemaIcon}>🎬</div>
                <h2 className={styles.noCinemaTitle}>Оберіть кінотеатр</h2>
                <p className={styles.noCinemaText}>
                    Натисніть кнопку у навігаційній панелі щоб обрати місто та кінотеатр
                </p>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Скоро у прокаті</h1>
                <p className={styles.subtitle}>{cinema.name}</p>
            </div>

            {moviesByDate.length === 0 ? (
                <p className={styles.empty}>Немає запланованих сеансів</p>
            ) : (
                <div className={styles.dateGroups}>
                    {moviesByDate.map(([key, { label, movies }]) => (
                        <div key={key} className={styles.dateGroup}>
                            <div className={styles.dateLabel}>
                                <span className={styles.dateLabelMain}>{label.main}</span>
                                <span className={styles.dateLabelSub}>{label.sub}</span>
                            </div>
                            <div className={styles.moviesRow}>
                                {movies.map(session => {
                                    const posterUrl = getPosterUrl(session.poster_url)
                                    return (
                                        <div
                                            key={session.movie_id}
                                            className={styles.movieCard}
                                            onClick={() => router.push(PAGES_URL.MOVIE(session.movie_id))}
                                        >
                                            <div className={styles.posterWrap}>
                                                {posterUrl ? (
                                                    <img
                                                        src={posterUrl}
                                                        alt={session.movie_title ?? ''}
                                                        className={styles.poster}
                                                    />
                                                ) : (
                                                    <div className={styles.posterPlaceholder}>🎬</div>
                                                )}
                                                <div className={styles.badge}>Квитки у продажу</div>
                                            </div>
                                            <p className={styles.movieTitle}>
                                                {session.movie_title ?? `Фільм #${session.movie_id}`}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
