'use client'

import { useState, useEffect } from 'react'
import { sessionService } from '@/api/session.service'
import { ISession } from '@/types/session.interface'
import styles from './style.module.css'

type Props = {
    movieId: number;
    cityId?: number;
    cinemaId?: number;
    inTheMovieBlock?: boolean;
    isAdmin?: boolean;
    onSessionClick?: (session: ISession) => void;
}



function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    const days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня']
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`
}

export default function SessionSchedule({ movieId, cityId, cinemaId, inTheMovieBlock, isAdmin, onSessionClick }: Props) {
    const [sessions, setSessions] = useState<ISession[]>([])
    const [selectedDate, setSelectedDate] = useState<string>('')
    const [dates, setDates] = useState<string[]>([])

    useEffect(() => {
        sessionService.getByMovieId(movieId).then(data => {
            let filtered = data;
            if (cinemaId) {
                filtered = filtered.filter(s => Number(s.cinema_id) === cinemaId);
            } else if (cityId) {
                filtered = filtered.filter(s => Number(s.city_id) === cityId);
            }

            setSessions(filtered)

            const uniqueDates = Array.from(new Set(filtered.map(s => s.start_time.split(' ')[0]))) as string[]
            setDates(uniqueDates)
            setSelectedDate(prev => uniqueDates.includes(prev) ? prev : (uniqueDates[0] ?? ''))
        }).catch(console.error)
    }, [movieId, cinemaId, cityId])

    if (sessions.length === 0) {
        return (
            <div className={styles.schedule}>
                <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px' }}>
                    Немає сеансів для вибраного фільму у цьому місці.
                </p>
            </div>
        )
    }

    const filteredSessions = sessions.filter(s => s.start_time.startsWith(selectedDate))

    const grouped = filteredSessions.reduce((acc: Record<string, Record<string, ISession[]>>, s) => {
        const cinemaKey = s.cinema_name ?? 'Невідомий кінотеатр'
        if (!acc[cinemaKey]) acc[cinemaKey] = {}
        const langKey = `${s.format} ${s.language_tag}`
        if (!acc[cinemaKey][langKey]) acc[cinemaKey][langKey] = []
        acc[cinemaKey][langKey].push(s)
        return acc
    }, {})

    return (
        <div className={`${styles.schedule} ${inTheMovieBlock ? styles.inTheMovieBlock : ''}`}>
            <div className={styles.header}>
                <h2 className={styles.title}>Розклад сеансів</h2>
                <select
                    className={styles.datePicker}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                >
                    {dates.map(date => (
                        <option key={date} value={date}>{formatDate(date)}</option>
                    ))}
                </select>
            </div>

            <div className={styles.cinemaList}>
                {Object.keys(grouped).map(cinemaName => (
                    <div key={cinemaName} className={styles.cinemaGroup}>
                        <h3 className={styles.cinemaName}>{cinemaName}</h3>
                        <p className={styles.cinemaAddress}>
                            {grouped[cinemaName][Object.keys(grouped[cinemaName])[0]][0].cinema_address}
                        </p>
                        <div className={styles.formats}>
                            {Object.keys(grouped[cinemaName]).map(langKey => (
                                <div key={langKey} className={styles.formatGroup}>
                                    <h4 className={styles.formatTitle}>{langKey}</h4>
                                    <div className={styles.timeList}>
                                        {grouped[cinemaName][langKey].map(s => (
                                            <div
                                                key={s.id}
                                                className={`${styles.timeItem} ${onSessionClick ? styles.clickable : ''}`}
                                                onClick={() => onSessionClick && onSessionClick(s)}
                                            >
                                                <span className={styles.time}>{s.start_time.split(' ')[1].substring(0, 5)}</span>
                                                <span className={styles.price}>{Math.round(s.base_price)} грн</span>
                                                {isAdmin && s.hall_name && (
                                                    <span className={styles.adminHall}>
                                                        {s.hall_name}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
