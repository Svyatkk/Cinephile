'use client'

import styles from './styles.module.css'
import { cinemaService } from '@/api/cinema.service'
import BLockCinema from '@/components/BlockCinema/BlockCinema'
import { ICinema, ICity } from '@/types/cinema.interface'
import { useEffect, useState } from 'react'
import { cityService } from '@/api/city.service'

export default function CinemasPage() {

    const [cinemas, setCinemas] = useState<ICinema[] | null>([])
    const [chosenCity, setChosenCity] = useState<ICity | null>(null)
    const [cities, setCities] = useState<ICity[] | undefined>([])
    const [filterdCinemas, setfilterdCinemas] = useState<ICinema[] | null>([])

    useEffect(() => {
        cityService.getAll()
            .then(data => setCities(data))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        cinemaService.getAll()
            .then(data => setCinemas(data))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        setfilterdCinemas(cinemas?.filter(cinema => cinema.city_id === chosenCity?.id) ?? [])
    }, [chosenCity, cinemas])

    const displayed = chosenCity ? filterdCinemas : cinemas

    return (
        <div className={styles.page}>
            <div className={styles.filterSection}>
                <select
                    onChange={(e) => {
                        const city = cities?.find(c => c.name === e.target.value)
                        setChosenCity(city || null)
                    }}
                    value={chosenCity?.name || ""}
                >
                    <option value="">Всі міста</option>
                    {cities?.map(city => (
                        <option key={city.id} value={city.name}>{city.name}</option>
                    ))}
                </select>
            </div>
            <div className={styles.grid}>
                {displayed?.map(cinema => (
                    <BLockCinema
                        key={cinema.id}
                        cinema={cinema}
                        cityName={cities?.find(c => c.id === cinema.city_id)?.name}
                    />
                ))}
            </div>
        </div>
    )
}