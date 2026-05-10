'use client'
import styles from './styles.module.css'
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sessionService } from '@/api/session.service';
import { seatService } from '@/api/seat.service';
import { orderService } from '@/api/order.service';
import { ISession } from '@/types/session.interface';
import Link from 'next/link';
import { ISeat } from '@/types/seat.interface';

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('sessionId');
    const seatIdsStr = searchParams.get('seatIds');

    const [session, setSession] = useState<ISession | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<ISeat[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!sessionId || !seatIdsStr) {
            setError('Некоректні дані замовлення');
            setLoading(false);
            return;
        }

        const seatIds = seatIdsStr.split(',').map(Number);

        Promise.all([
            sessionService.getById(Number(sessionId)),
            seatService.getForSession(Number(sessionId))
        ]).then(([sessionData, seatsData]) => {
            setSession(sessionData);
            const filteredSeats = seatsData.filter(s => seatIds.includes(s.id));
            setSelectedSeats(filteredSeats);
            setLoading(false);
        }).catch(err => {
            setError('Помилка завантаження даних. Будь ласка, спробуйте ще раз.');
            setLoading(false);
        });
    }, [sessionId, seatIdsStr]);

    const handlePayment = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr || !session) return;
        const user = JSON.parse(userStr);

        setProcessing(true);
        setError(null);

        const totalAmount = selectedSeats.length * session.base_price;
        const seatIds = selectedSeats.map(s => s.id);

        try {
            await orderService.createOrder({
                user_id: user.id,
                session_id: session.id,
                seat_ids: seatIds,
                total_amount: totalAmount
            });
            router.push('/order-success');
        } catch (err: any) {
            setError(err.message || 'Помилка при оплаті. Можливо час бронювання вийшов.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className={styles.page}>Завантаження замовлення...</div>;
    if (error && !session) return <div className={styles.page}>{error}</div>;
    if (!session) return null;

    const formattedDate = new Date(session.start_time).toLocaleDateString('uk-UA', {
        weekday: 'long', day: 'numeric', month: 'long'
    });
    const formattedTime = new Date(session.start_time).toLocaleTimeString('uk-UA', {
        hour: '2-digit', minute: '2-digit'
    });
    const totalAmount = selectedSeats.length * session.base_price;

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>Оформлення замовлення</h1>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.summaryCard}>
                    <div className={styles.movieInfo}>
                        <h2 className={styles.movieTitle}>Фільм: {session.movie_id}</h2> {/* You might want to pass movie title down or fetch it */}
                        <div className={styles.sessionDetails}>
                            <p>{session.cinema_name}, {session.hall_name}</p>
                            <p>{formattedDate} о {formattedTime}</p>
                            <p>Формат: {session.format} · {session.language_tag}</p>
                        </div>
                    </div>

                    <div className={styles.ticketsSection}>
                        <h3 className={styles.sectionTitle}>Ваші квитки ({selectedSeats.length} шт.)</h3>
                        {selectedSeats.map(seat => (
                            <div key={seat.id} className={styles.ticketItem}>
                                <div className={styles.ticketLocation}>
                                    Ряд {seat.row_num}, Місце {seat.seat_num}
                                </div>
                                <div className={styles.ticketPrice}>
                                    {Math.round(session.base_price)} грн
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.totalSection}>
                        <span className={styles.totalLabel}>Загальна сума:</span>
                        <span className={styles.totalAmount}>{Math.round(totalAmount)} грн</span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button
                        className={styles.cancelBtn}
                        onClick={() => router.back()}
                        disabled={processing}
                    >
                        Скасувати
                    </button>
                    <button
                        className={styles.payBtn}
                        onClick={handlePayment}
                        disabled={processing}
                    >
                        {processing ? 'Обробка...' : 'Забронювати'}
                    </button>
                </div>
            </div>

        </div>
    );
}