'use client'

import { useEffect, useState } from 'react'
import styles from './style.module.css'
import { BASE_URL, fetchOptions } from '@/api/config'

interface TopMovie {
    title: string;
    tickets_sold: number;
    revenue: number;
}

interface IStatistics {
    total_revenue: number;
    total_tickets: number;
    total_users: number;
    top_movies: TopMovie[];
}

export default function StatisticsPanel() {
    const [stats, setStats] = useState<IStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${BASE_URL}/statistics`, {
                    method: 'GET',
                    ...fetchOptions
                });
                if (!response.ok) throw new Error('Помилка завантаження статистики');
                const result = await response.json();
                if (result.success) {
                    setStats(result.data);
                } else {
                    throw new Error(result.message);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className={styles.container}>Завантаження статистики...</div>;
    if (error) return <div className={styles.container}>Помилка: {error}</div>;
    if (!stats) return <div className={styles.container}>Немає даних</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Загальна статистика системи</h2>

            <div className={styles.cardsGrid}>
                <div className={styles.card}>
                    <span className={styles.cardLabel}>Загальний дохід</span>
                    <span className={styles.cardValue}>{Math.round(stats.total_revenue)} ₴</span>
                </div>
                <div className={styles.card}>
                    <span className={styles.cardLabel}>Продано квитків</span>
                    <span className={styles.cardValue}>{stats.total_tickets}</span>
                </div>
                <div className={styles.card}>
                    <span className={styles.cardLabel}>Зареєстрованих користувачів</span>
                    <span className={styles.cardValue}>{stats.total_users}</span>
                </div>
            </div>

            <h3 className={styles.subTitle}>Топ-5 фільмів за популярністю</h3>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Назва фільму</th>
                            <th>Продано квитків</th>
                            <th>Принесений дохід (₴)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.top_movies.map((movie, index) => (
                            <tr key={index}>
                                <td>{movie.title}</td>
                                <td>{movie.tickets_sold}</td>
                                <td>{Math.round(movie.revenue)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
