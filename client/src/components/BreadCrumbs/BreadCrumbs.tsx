'use client'
import styles from './styles.module.css'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

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

    return (
        <section className={styles.breadCrumbs}>
            <div className={styles.logoBox} onClick={() => router.push('/')}>
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
                            {isDisabled ? (
                                <span className={`${styles.link} ${styles.linkInactive} ${styles.linkDisabled}`}>
                                    {link.name} {isLast && <span className={styles.emojis}>😉 🤟</span>}
                                </span>
                            ) : (
                                <Link
                                    href={`${link.link}${searchSuffix}`}
                                    className={`${styles.link} ${isActive ? styles.linkActive : styles.linkInactive}`}
                                >
                                    {link.name} {isLast && <span className={styles.emojis}>😉 🤟</span>}
                                </Link>
                            )}
                            {!isLast && <span className={styles.separator}>&gt;</span>}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}