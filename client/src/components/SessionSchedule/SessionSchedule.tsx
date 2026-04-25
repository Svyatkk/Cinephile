'use client'
import { useState, useEffect } from 'react'
import { sessionService } from '@/api/session.service'
import { ISession } from '@/types/session.interface'
import styles from './style.module.css'

type Props = {
    movieId: number
}


export default function SessionSchedule({ movieId }: Props) {
    const [sessions, setSessions] = useState<ISession[]>([])
    const [selectedDate, setSelectedDate] = useState<string>('')
    const [dates, setDates] = useState<string[]>([])

    useEffect(() => {
        sessionService.getByMovieId(movieId).then(data => {
            setSessions(data)



            const uniqueDates = Array.from(new Set(data.map((s: any) => s.start_time.split(' ')[0])))
            setDates(uniqueDates)
            if (uniqueDates.length > 0) {
                setSelectedDate(uniqueDates[0])
            }
        }).catch(console.error)
    }, [movieId])

    if (sessions.length === 0) return null

    const filteredSessions = sessions.filter((s: any) => s.start_time.startsWith(selectedDate))


    const grouped = filteredSessions.reduce((acc: any, s: any) => {
        const cinemaKey = s.cinema_name
        if (!acc[cinemaKey]) acc[cinemaKey] = {}

        const langKey = `${s.format} ${s.language_tag}`
        if (!acc[cinemaKey][langKey]) acc[cinemaKey][langKey] = []

        acc[cinemaKey][langKey].push(s)
        return acc
    }, {})

    return (
        <div className={styles.schedule}>
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
                        <p className={styles.cinemaAddress}>{grouped[cinemaName][Object.keys(grouped[cinemaName])[0]][0].cinema_address}</p>

                        <div className={styles.formats}>
                            {Object.keys(grouped[cinemaName]).map(langKey => (
                                <div key={langKey} className={styles.formatGroup}>
                                    <h4 className={styles.formatTitle}>{langKey}</h4>
                                    <div className={styles.timeList}>
                                        {grouped[cinemaName][langKey].map((s: any) => (
                                            <div key={s.id} className={styles.timeItem}>
                                                <span className={styles.time}>{s.start_time.split(' ')[1].substring(0, 5)}</span>
                                                <span className={styles.price}>{Math.round(s.base_price)} грн</span>
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


function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    const days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня']
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`
}
