'use client'
import { useEffect, useState } from "react"
import { IUser } from "@/types/user.interface"
import styles from './style.module.css'
import { PAGES_URL } from "@/api/config"
import Link from "next/link"
import Image from "next/image"
import { orderService } from "@/api/order.service"
import { IOrder, ITicket } from "@/types/order.interface"

export default function Account() {

    const [user, setUser] = useState<IUser | null>(null)
    const [orders, setOrders] = useState<IOrder[]>([])

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            orderService.getOrders(parsedUser.id).then(setOrders).catch(console.error);

        }
    }, [])

    const handleCancelOrder = async (orderId: number) => {
        if (!confirm('Ви впевнені, що хочете скасувати це бронювання?')) return;

        if (user) {
            try {
                const { orderService } = await import('@/api/order.service');
                await orderService.cancelOrder(orderId, user.id);
                setOrders(prev => prev.filter(o => o.id !== orderId));
            } catch (error: any) {
                alert(error.message || 'Не вдалося скасувати бронювання');
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.cabinetBox}>
                    <h1>Мій кабінет</h1>

                    {user ? (
                        <>
                            <div className={styles.userInfo}>
                                <div className={styles.avatar}>
                                    <Image src="/profileImg.svg" alt="User Avatar" width={50} height={50} className={styles.avatarImg} />
                                </div>
                                <div className={styles.details}>
                                    <div className={styles.field}>
                                        <span className={styles.label}>Email</span>
                                        <span className={styles.value}>{user.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.orders}>
                                <h2>Мої квитки</h2>
                                {orders.length === 0 ? (
                                    <div className={styles.emptyOrders}>У вас ще немає замовлень. Час обрати фільм!</div>
                                ) : (
                                    <div className={styles.orderList}>
                                        {orders.map((order: IOrder) => (
                                            <div key={order.id} className={styles.orderCard}>
                                                <div className={styles.orderHeader}>
                                                    <span className={styles.orderDate}>
                                                        Замовлення від {new Date(order.created_at).toLocaleDateString('uk-UA')}
                                                    </span>
                                                    <div className={styles.statusActions}>
                                                        <span className={styles.orderStatus}>Заброньовано</span>
                                                        <button
                                                            className={styles.cancelOrderBtn}
                                                            onClick={() => handleCancelOrder(order.id)}
                                                        >
                                                            Скасувати
                                                        </button>
                                                    </div>
                                                </div>
                                                {order.tickets && order.tickets.map((ticket: ITicket) => (
                                                    <div key={ticket.id} className={styles.ticketInfo}>
                                                        <div className={styles.movieTitle}>{ticket.movie_title}</div>
                                                        <div className={styles.sessionDetails}>
                                                            {ticket.cinema_name}, {ticket.hall_name} • {new Date(ticket.start_time).toLocaleString('uk-UA')}
                                                        </div>
                                                        <div className={styles.seatDetails}>
                                                            Ряд {ticket.row_num}, Місце {ticket.seat_num}
                                                        </div>
                                                        <div className={styles.barcode}>
                                                            Штрихкод: <strong>{ticket.barcode}</strong>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className={styles.orderTotal}>
                                                    Сума: {Math.round(order.total_amount)} грн
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className={styles.authPrompt}>
                            <h1>УПС...</h1>
                            <p>Для перегляду особистого кабінету спочатку увійдіть в акаунт</p>
                            <Link href={PAGES_URL.AUTH} className={styles.loginBtn}>Увійти</Link>
                        </div>
                    )}
                </div>

                {
                    user && user.role === 'admin' && (
                        <div className={styles.adminPanel}>
                            <h2>Адмін панель</h2>
                            <div className={styles.adminLinks}>
                                <Link href={PAGES_URL.ADMIN} className={styles.adminLink}>Перейти в адмін панель</Link>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}