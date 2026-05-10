import styles from './styles.module.css';
import Link from 'next/link';
import { PAGES_URL } from '@/api/config';

export default function OrderSuccessPage() {
    return (
        <div className={styles.page}>
            <div className={styles.successContent}>
                <div className={styles.successIcon}>✓</div>
                <h1 className={styles.successTitle}>Бронювання успішно завершено!</h1>
                <p className={styles.successText}>
                    Ваші квитки успішно заброньовані та збережені у вашому особистому кабінеті. 
                    Ми також надіслали копію на вашу електронну пошту.
                    Бажаємо приємного перегляду! 😉 🍿
                </p>
                <div className={styles.buttons}>
                    <Link href={PAGES_URL.MAIN} className={styles.homeBtn}>
                        На головну
                    </Link>
                    <Link href={PAGES_URL.ACCOUNT} className={styles.profileBtn}>
                        Мої квитки
                    </Link>
                </div>
            </div>
        </div>
    );
}
