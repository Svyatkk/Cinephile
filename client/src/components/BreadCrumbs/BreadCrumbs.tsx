'use client'
import styles from './styles.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { PAGES_URL } from '@/api/config'
import { orderService } from '@/api/order.service'
type Props = {
    arr?: {
        name: string,
        link: string
    }[]
}

export default function BreadCrumbs({ ...arr }: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const queryString = searchParams.toString();
    const searchSuffix = queryString ? `?${queryString}` : '';

    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const isSuccessPage = pathname.includes('order-success');


    const handleUnlockAndNavigate = async (destination: string) => {
        sessionStorage.removeItem('booking_expiry');
        sessionStorage.removeItem('last_booking_page');
        const sessionId = searchParams.get('sessionId');
        if (sessionId && pathname.includes('checkout')) {
            try {
                await orderService.unlockSeats(Number(sessionId));
            } catch (e) {
            }
        }
        router.push(destination);
    };

    useEffect(() => {
        if (isSuccessPage) {
            sessionStorage.removeItem('booking_expiry');
            return;
        }

        let expiryStr = sessionStorage.getItem('booking_expiry');
        let expiryTime: number;

        if (!expiryStr) {
            expiryTime = Date.now() + 15 * 60 * 1000;
            sessionStorage.setItem('booking_expiry', String(expiryTime));
        } else {
            expiryTime = Number(expiryStr);
        }

        const updateTimer = () => {
            const now = Date.now();
            const diff = Math.max(0, Math.floor((expiryTime - now) / 1000));
            setTimeLeft(diff);

            if (diff <= 0) {
                clearInterval(interval);
                sessionStorage.removeItem('booking_expiry');
                alert('Час сесії бронювання вичерпано. Будь ласка, оберіть місця знову.');
                router.push(PAGES_URL.MAIN);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [pathname, router, isSuccessPage]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <section className={styles.breadCrumbs}>
            <div className={styles.logoBox} onClick={() => handleUnlockAndNavigate(PAGES_URL.MAIN)}>
                Cinephile
            </div>

            <div className={styles.linksContainer}>
                {arr.arr?.map((link, index) => {
                    const isActive = pathname === link.link || pathname.startsWith(link.link);
                    const isLast = index === (arr.arr?.length ?? 0) - 1;

                    const hasSeats = searchParams.get('seatIds');
                    const needsSeats = link.link.includes('checkout') || link.link.includes('order-success');
                    const isDisabled = needsSeats && !hasSeats;

                    return (
                        <div className={styles.linkItem} key={index}>
                            {pathname.includes('checkout') && link.link.includes(PAGES_URL.SEATPLAN) ? (
                                <span
                                    className={`${styles.link} ${isActive ? styles.linkActive : styles.linkInactive}`}
                                    onClick={() => handleUnlockAndNavigate(`${link.link}${searchSuffix}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {link.name}
                                </span>
                            ) : isDisabled ? (
                                <span className={`${styles.link} ${styles.linkInactive} ${styles.linkDisabled}`}>
                                    {link.name} {isLast && <span className={styles.emojis}>😉 🤟</span>}
                                </span>
                            ) : (
                                <Link href={`${link.link}${searchSuffix}`} className={`${styles.link} ${isActive ? styles.linkActive : styles.linkInactive}`}>
                                    {link.name} {isLast && <span className={styles.emojis}>😉 🤟</span>}
                                </Link>
                            )}
                        </div>
                    )
                })}
            </div>

            {!isSuccessPage && timeLeft !== null && (
                <div className={styles.timerContainer}>
                    <svg className={styles.timerIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span className={styles.timerText}>{formatTime(timeLeft)}</span>
                </div>
            )}
        </section>
    )
}