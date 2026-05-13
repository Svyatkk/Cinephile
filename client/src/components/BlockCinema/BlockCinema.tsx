'use client'

import { ICinema } from '@/types/cinema.interface'
import styles from './styles.module.css'
import { PAGES_URL } from '@/api/config'
import { useRouter } from 'next/navigation'

type Props = {
    cinema: ICinema
    cityName?: string
}

export default function BlockCinema({ cinema, cityName }: Props) {
    const router = useRouter()

    return (
        <div className={styles.card} onClick={() => router.push(PAGES_URL.CINEMA(cinema.id))}>
            <div className={styles.cardTop}>
                <h3 className={styles.name}>{cinema.name}</h3>
                {cityName && <span className={styles.cityBadge}>{cityName}</span>}
            </div>
            <p className={styles.address}>📍 {cinema.address}</p>
            <button className={styles.btn}>Дивитись розклад</button>
        </div>
    )
}