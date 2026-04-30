'use client'

import styles from './style.module.css'
import { IMovie } from '@/types/movie.interface'
import { useRouter } from 'next/navigation'
import { PAGES_URL, BASE_URL } from '@/api/config'
import { movieService } from '@/api/movie.service'
import { useEffect, useState } from 'react'
import { ISession } from '@/types/session.interface'
import { time } from 'console'
import { sessionService } from '@/api/session.service'
import SessionSchedule from '../SessionSchedule/SessionSchedule'
import Link from 'next/link'
import Image from 'next/image'
type Props = {
    movie: IMovie
}

export default function MovieBlock({ movie }: Props) {
    const [sessions, setSessions] = useState<ISession[]>([]);
    const [active, setActive] = useState<boolean>(false);

    useEffect(() => {
        sessionService.getByMovieId(Number(movie?.id))
            .then(data => setSessions(data))
            .catch(err => console.error('Error fetching sessions:', err));
    }, [movie?.id]);

    const getClosestSession = () => {
        if (!sessions || sessions.length === 0) return null;
        const now = new Date();

        const futureSessions = sessions
            .filter(s => new Date(s.start_time) > now)
            .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

        return futureSessions.length > 0 ? futureSessions[0] : null;
    };

    const closestSession = getClosestSession();
    const route = useRouter();
    const poster = movie.poster_url;
    const fullImageUrl = poster?.startsWith('http')
        ? poster
        : `http://localhost/api/${poster?.startsWith('/') ? poster.slice(1) : poster}`;

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div
            className={styles.block}
            style={{ backgroundImage: `url("${fullImageUrl}")` }}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
        >
            <div className={`${styles.information} ${active ? styles.active : ""}`}>
                <div className={styles.blockInfo}>
                    <div className={styles.topActions}>
                        <Link href={PAGES_URL.MOVIE(movie?.id)} className={styles.actionBtn}>
                            <div className={styles.iconBox}>i</div>
                            Детальніше<br />про фільм
                        </Link>
                        <button className={styles.actionBtn}>
                            <div className={styles.iconBox}>▶</div>
                            Дивитись<br />Трейлер
                        </button>
                    </div>

                    <div className={styles.cinemaTitle}>Cinephile Cinema</div>

                    {closestSession ? (
                        <>
                            <div className={styles.todayLabel}>Сьогодні</div>
                            <div className={styles.closestSessionSection}>
                                <div className={styles.sectionHeading}>Найближчий сеанс</div>
                                <div className={styles.closestSessionBox}>
                                    <div className={styles.timeDisplay}>
                                        <div className={styles.timeText}>{formatTime(closestSession.start_time)}</div>
                                        <div className={styles.formatText}>{closestSession.format || '2D'}</div>
                                    </div>
                                    <button className={styles.buyBtn}>Купити квиток</button>
                                </div>
                                <SessionSchedule inTheMovieBlock={true} movieId={Number(movie?.id)} />
                            </div>
                        </>
                    ) : (
                        <div className={styles.premiereContainer}>
                            <div className={styles.doorIcon}>🚪</div>
                            <div className={styles.premiereLabel}>Прем'єра</div>
                            <div className={styles.premiereDateText}>
                                {movie.release_year ? `У ${movie.release_year} році` : 'Незабаром'}
                            </div>
                            <div className={styles.ticketsStatus}>Квитки у продажу!</div>
                        </div>
                    )}
                </div>
            </div>

            <h3
                className={styles.title}
                onClick={() => route.push(PAGES_URL.MOVIE(movie?.id))}
            >
                {movie.title}
            </h3>
        </div>
    );
}
