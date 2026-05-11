'use client'


import { ICinema } from '@/types/cinema.interface'
import styles from './styles.module.css'

type Props = {
    cinema: ICinema
}

export default function BLockCinema({ cinema }: Props) {
    return (
        <div className={styles.block}>
            {cinema.name}
        </div>
    )
}