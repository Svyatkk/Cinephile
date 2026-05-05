'use client'
import styles from './styles.module.css'
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sessionService } from '@/api/session.service';
import { ISession } from '@/types/session.interface';

export default function SeatPlanPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('sessionId');

    const [session, setSession] = useState<ISession | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!sessionId) {
            setError('Сеанс не вибрано');
            setLoading(false);
            return;
        }

        sessionService.getById(Number(sessionId))
            .then(data => {
                setSession(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Не вдалося завантажити дані сеансу');
                setLoading(false);
            });
    }, [sessionId]);

    if (loading) return <div className={styles.page}>Завантаження...</div>;
    if (error || !session) return <div className={styles.page}>{error ?? 'Сеанс не знайдено'}</div>;

    const formattedDate = new Date(session.start_time).toLocaleDateString('uk-UA', {
        weekday: 'long', day: 'numeric', month: 'long'
    });
    const formattedTime = new Date(session.start_time).toLocaleTimeString('uk-UA', {
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className={styles.page}>
            <div className={styles.sessionInfo}>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Зал</span>
                    <span className={styles.value}>{session.hall_name}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>🏛️ Кінотеатр</span>
                    <span className={styles.value}>{session.cinema_name}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Місто</span>
                    <span className={styles.value}>{session.city_name}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Дата</span>
                    <span className={styles.value}>{formattedDate}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Час</span>
                    <span className={styles.value}>{formattedTime}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Формат</span>
                    <span className={styles.value}>{session.format} · {session.language_tag}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Ціна</span>
                    <span className={styles.value}>{Math.round(session.base_price)} грн</span>
                </div>
            </div>

            {/* Тут буде схема залу */}


            <div className={styles.hallPlaceholder}>
                <p>Схема залу буде тут</p>
            </div>
        </div>
    );
}
