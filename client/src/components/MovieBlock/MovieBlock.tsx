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

    const isSoon = closestSession
        ? (new Date(closestSession.start_time).getTime() - Date.now()) > 7 * 24 * 60 * 60 * 1000
        : true;

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
            {isSoon && (
                <div className={styles.soonBadge}>Скоро</div>
            )}

            <div className={`${styles.information} ${active ? styles.active : ""}`}>
                <div className={styles.blockInfo}>
                    <div className={styles.topActions}>
                        <Link href={PAGES_URL.MOVIE(Number(movie?.id))} className={styles.actionBtn}>
                            <div className={styles.iconBox}>i</div>
                            Детальніше<br />про фільм
                        </Link>
                        <button className={styles.actionBtn}>
                            <div className={styles.iconBox}>▶</div>
                            Дивитись<br />Трейлер
                        </button>
                    </div>

                    <div className={styles.cinemaTitle}>Cinephile Cinema</div>

                    {closestSession && !isSoon ? (
                        <>
                            <div className={styles.todayLabel}>Сьогодні</div>
                            <div className={styles.closestSessionSection}>
                                <div className={styles.sectionHeading}>Найближчий сеанс</div>
                                <div className={styles.closestSessionBox}>
                                    <div className={styles.timeDisplay}>
                                        <div className={styles.timeText}>{formatTime(closestSession.start_time)}</div>
                                        <div className={styles.formatText}>{closestSession.format || '2D'}</div>
                                    </div>
                                    <button
                                        className={styles.buyBtn}
                                        onClick={() => {
                                            if (closestSession?.id) {
                                                sessionStorage.removeItem('booking_expiry');
                                                sessionStorage.removeItem('last_booking_page');
                                                route.push(`${PAGES_URL.SEATPLAN}?sessionId=${closestSession.id}`);
                                            }
                                        }}
                                    >Купити квиток</button>
                                </div>
                                <SessionSchedule inTheMovieBlock={true} movieId={Number(movie?.id)} />
                            </div>
                        </>
                    ) : closestSession && isSoon ? (
                        <div className={styles.premiereContainer}>
                            <div className={styles.doorIcon}>📅</div>
                            <div className={styles.premiereLabel} style={{ color: '#ff3b4a', fontWeight: '800' }}>Скоро в прокаті</div>
                            <div className={styles.premiereDateText}>
                                {new Date(closestSession.start_time).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                            <div className={styles.ticketsStatus}>Попередній продаж відкритий!</div>
                            <button
                                className={styles.buyBtn}
                                style={{ marginTop: '15px', background: 'linear-gradient(135deg, #fbbc05, #e5a703)', color: '#000', fontWeight: 'bold' }}
                                onClick={() => {
                                    if (closestSession?.id) {
                                        sessionStorage.removeItem('booking_expiry');
                                        sessionStorage.removeItem('last_booking_page');
                                        route.push(`${PAGES_URL.SEATPLAN}?sessionId=${closestSession.id}`);
                                    }
                                }}
                            >
                                Забронювати заздалегідь
                            </button>
                        </div>
                    ) : (
                        <div className={styles.premiereContainer}>
                            <div className={styles.doorIcon}>🚪</div>
                            <div className={styles.premiereLabel}>Прем'єра</div>
                            <div className={styles.premiereDateText}>
                                {movie.release_year ? `У ${movie.release_year} році` : 'Незабаром'}
                            </div>
                            <div className={styles.ticketsStatus}>Очікуйте анонсу сеансів</div>
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
