'use client'
import { cinemaService } from "@/api/cinema.service"
import { sessionService } from "@/api/session.service"
import { ICinema } from "@/types/cinema.interface"
import { ISession } from "@/types/session.interface"
import { useEffect, useState, useMemo } from "react"
import styles from './styles.module.css'
import { useRouter } from "next/navigation"
import { PAGES_URL } from "@/api/config"

type Props = {
    id: string
}

function getDateTabs() {
    const tabs: Date[] = []
    for (let i = 0; i < 7; i++) {
        const d = new Date()
        d.setDate(d.getDate() + i)
        tabs.push(d)
    }
    return tabs
}

function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
}

function getPosterUrl(poster?: string) {
    if (!poster) return null
    return poster.startsWith('http')
        ? poster
        : `http://localhost/api/${poster.startsWith('/') ? poster.slice(1) : poster}`
}

export default function CinemaPage({ id }: Props) {
    const router = useRouter()
    const [cinema, setCinema] = useState<ICinema>()
    const [sessions, setSessions] = useState<ISession[]>([])
    const [selectedDate, setSelectedDate] = useState(0)
    const [selectedFormat, setSelectedFormat] = useState<string>('all')

    const dateTabs = useMemo(() => getDateTabs(), [])

    useEffect(() => {
        cinemaService.getById(id)
            .then(data => setCinema(data))
            .catch(() => { })

        sessionService.getByCinemaId(id)
            .then(data => setSessions(data))
            .catch(err => console.log(err))
    }, [id])

    const cinemaName = cinema?.name ?? sessions[0]?.cinema_name ?? ''
    const cinemaAddress = cinema?.address ?? sessions[0]?.cinema_address ?? ''

    const formats = useMemo(() => {
        return [...new Set(sessions.map(s => s.format))]
    }, [sessions])

    const filteredSessions = useMemo(() => {
        const selectedDay = dateTabs[selectedDate]
        return sessions.filter(s => {
            const sessionDate = new Date(s.start_time)
            const dayMatch = isSameDay(sessionDate, selectedDay)
            const formatMatch = selectedFormat === 'all' || s.format === selectedFormat
            return dayMatch && formatMatch
        })
    }, [sessions, selectedDate, selectedFormat, dateTabs])

    const groupedByMovie = useMemo(() => {
        const map = new Map<number, { title: string; sessions: ISession[] }>()
        filteredSessions.forEach(s => {
            if (!map.has(s.movie_id)) {
                map.set(s.movie_id, {
                    title: s.movie_title ?? `Фільм #${s.movie_id}`,
                    sessions: []
                })
            }
            map.get(s.movie_id)!.sessions.push(s)
        })
        return [...map.entries()]
    }, [filteredSessions])

    const formatTime = (dateStr: string) =>
        new Date(dateStr).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })

    const getTabLabel = (d: Date, i: number) => {
        if (i === 0) return { top: 'Сьогодні', bottom: d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' }) }
        if (i === 1) return { top: 'Завтра', bottom: d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' }) }
        return {
            top: d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' }),
            bottom: d.toLocaleDateString('uk-UA', { weekday: 'long' })
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.banner}>
                <div className={styles.bannerOverlay} />
                <div className={styles.bannerContent}>
                    <p className={styles.bannerSub}>Кінотеатр Cinephile</p>
                    <h1 className={styles.bannerTitle}>{cinemaName}</h1>
                    {cinemaAddress && (
                        <p className={styles.bannerAddress}>📍 {cinemaAddress}</p>
                    )}
                </div>
            </div>

            <div className={styles.dateTabs}>
                {dateTabs.map((d, i) => {
                    const label = getTabLabel(d, i)
                    return (
                        <button
                            key={i}
                            className={`${styles.dateTab} ${selectedDate === i ? styles.activeTab : ''}`}
                            onClick={() => setSelectedDate(i)}
                        >
                            <span className={styles.dateTabTop}>{label.top}</span>
                            <span className={styles.dateTabBottom}>{label.bottom}</span>
                        </button>
                    )
                })}
            </div>

            {formats.length > 0 && (
                <div className={styles.formatFilter}>
                    <button
                        className={`${styles.formatBtn} ${selectedFormat === 'all' ? styles.activeFormat : ''}`}
                        onClick={() => setSelectedFormat('all')}
                    >Всі</button>
                    {formats.map(f => (
                        <button
                            key={f}
                            className={`${styles.formatBtn} ${selectedFormat === f ? styles.activeFormat : ''}`}
                            onClick={() => setSelectedFormat(f)}
                        >{f}</button>
                    ))}
                </div>
            )}

            <div className={styles.content}>
                {groupedByMovie.length === 0 ? (
                    <p className={styles.empty}>Немає сеансів на обраний день</p>
                ) : (
                    groupedByMovie.map(([movieId, { title, sessions: movieSessions }]) => {
                        const posterUrl = getPosterUrl(movieSessions[0]?.poster_url);
                        return (
                            <div key={movieId} className={styles.movieGroup}>
                                {/* Movie Poster */}
                                <div className={styles.moviePosterWrap}>
                                    {posterUrl ? (
                                        <img src={posterUrl} alt={title} className={styles.moviePoster} />
                                    ) : (
                                        <div className={styles.moviePosterPlaceholder}>🎬</div>
                                    )}
                                </div>

                                {/* Movie Details & Sessions */}
                                <div className={styles.movieDetails}>
                                    <div className={styles.movieHeader}>
                                        {movieSessions[0]?.age_restriction && (
                                            <span className={styles.age}>{movieSessions[0].age_restriction}+</span>
                                        )}
                                        <h3 className={styles.movieTitle}>{title}</h3>
                                        {movieSessions[0]?.duration_minutes && (
                                            <span className={styles.duration}>{movieSessions[0].duration_minutes} хв</span>
                                        )}
                                    </div>
                                    <div className={styles.sessionTimes}>
                                        {movieSessions.map(s => (
                                            <button
                                                key={s.id}
                                                className={styles.sessionBtn}
                                                onClick={() => {
                                                    if (s.id) {
                                                        sessionStorage.removeItem('booking_expiry');
                                                        sessionStorage.removeItem('last_booking_page');
                                                        router.push(`${PAGES_URL.SEATPLAN}?sessionId=${s.id}`);
                                                    }
                                                }}
                                            >
                                                <span className={styles.sessionTime}>{formatTime(s.start_time)}</span>
                                                <span className={styles.sessionMeta}>{s.format} · {s.language_tag}</span>
                                                <span className={styles.sessionHall}>{s.hall_name}</span>
                                                <span className={styles.sessionPrice}>{s.base_price} ₴</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    )
}