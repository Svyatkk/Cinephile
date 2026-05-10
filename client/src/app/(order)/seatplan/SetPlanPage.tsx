'use client'
import styles from './styles.module.css'
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sessionService } from '@/api/session.service';
import { seatService } from '@/api/seat.service';
import { ISeat } from '../../../types/seat.interface'
import { orderService } from '@/api/order.service';
import { ISession } from '@/types/session.interface';
import SeatsGrid from '@/components/SeatsGrid/SeatsGrid';

export default function SeatPlanPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('sessionId');

    const [session, setSession] = useState<ISession | null>(null);
    const [seats, setSeats] = useState<ISeat[]>([]);
    const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!sessionId) {
            setError('Сеанс не вибрано');
            setLoading(false);
            return;
        }

        Promise.all([
            sessionService.getById(Number(sessionId)),
            seatService.getForSession(Number(sessionId))
        ]).then(([sessionData, seatsData]) => {
            setSession(sessionData);
            setSeats(seatsData);
            setLoading(false);
        }).catch(err => {
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

    const handleSeatClick = (seat: ISeat) => {
        if (seat.is_purchased || seat.is_locked) return;

        setSelectedSeatIds(prev => {
            if (prev.includes(seat.id)) {
                return prev.filter(id => id !== seat.id);
            } else {
                return [...prev, seat.id];
            }
        });
    };

    const handleContinue = async () => {
        if (selectedSeatIds.length === 0) return;
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Будь ласка, увійдіть у систему для бронювання квитків');
            router.push('/auth');
            return;
        }

        const user = JSON.parse(userStr);
        setProcessing(true);
        setError(null);

        try {
            await orderService.lockSeats({
                user_id: user.id,
                session_id: session.id,
                seat_ids: selectedSeatIds
            });

            const seatIdsStr = selectedSeatIds.join(',');
            router.push(`/checkout?sessionId=${session.id}&seatIds=${seatIdsStr}`);
        } catch (err: any) {
            setError(err.message || 'Помилка при бронюванні. Можливо, місця вже зайняті.');

            const seatsData = await seatService.getForSession(session.id);
            setSeats(seatsData);
            setSelectedSeatIds([]);
        } finally {
            setProcessing(false);
        }
    };

    const totalPrice = selectedSeatIds.length * session.base_price;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Вибір місць</h1>
                <p className={styles.subtitle}>{session.cinema_name}, {session.hall_name} • {formattedDate}, {formattedTime}</p>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.hallContainer}>
                <div className={styles.screen}>
                    <span className={styles.screenText}>Екран</span>
                </div>

                <SeatsGrid
                    seats={seats}
                    selectedSeatIds={selectedSeatIds}
                    onSeatClick={handleSeatClick}
                />

                <div className={styles.legend}>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.seatAvailable}`}></div>
                        <span>Вільно</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.seatSelected}`}></div>
                        <span>Обрано</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.seatOccupied}`}></div>
                        <span>Зайнято</span>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <div className={styles.summary}>
                    <span className={styles.summaryText}>Обрано квитків: {selectedSeatIds.length}</span>
                    <span className={styles.totalPrice}>{Math.round(totalPrice)} грн</span>
                </div>
                <button
                    className={styles.continueBtn}
                    disabled={selectedSeatIds.length === 0 || processing}
                    onClick={handleContinue}
                >
                    {processing ? 'Обробка...' : 'Продовжити'}
                </button>
            </div>
        </div>
    );
}
