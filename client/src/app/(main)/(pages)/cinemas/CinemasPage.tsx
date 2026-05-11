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
    return (
        <div className={styles.page}>
            <div className={styles.filterSection}>
                <select
                    onChange={(e) => {
                        const city = cities?.find(c => c.name === e.target.value);
                        setChosenCity(city || null);
                    }}
                    value={chosenCity?.name || ""}
                >
                    <option value="" disabled>Оберіть місто</option>
                    {
                        cities?.map(city => {
                            return <option key={city.id} value={city.name}>{city.name}</option>
                        })
                    }
                </select>
            </div>
            <div className={styles.container}>

                {
                    chosenCity ?
                        filterdCinemas?.map(cinema => {
                            return <div key={cinema.id}>
                                <BLockCinema cinema={cinema}></BLockCinema>
                            </div>
                        })
                        :
                        cinemas?.map(cinema => {
                            return <div className={styles.cinemas} key={cinema.id}>
                                <BLockCinema cinema={cinema}></BLockCinema>
                            </div>
                        })
                }

            </div>

        </div >
    )
}