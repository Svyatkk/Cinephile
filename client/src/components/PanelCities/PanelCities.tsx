
'use client'
import { useState } from "react";
import styles from "./style.module.css";
import { ICinema, ICity } from "@/types/cinema.interface";

type Props = {
    active: boolean;
    cities: ICity[],
    setChosenCity?: (city: ICity) => void,
    setChosenCinema?: (cinema: ICinema) => void,
}

export default function PanelCities({ active, cities, setChosenCity, setChosenCinema, }: Props) {



    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

    const activeCity = cities.find(c => c.id === selectedCityId);

    return (
        <div className={`${styles.panelCitiesContainer} ${active ? styles.active : ''}`}>
            <div className={styles.rootCitiesPanel}>

                <div className={styles.leftCol}>
                    <h3 className={styles.colTitle}>Міста</h3>
                    <div className={styles.list}>
                        {cities.map((city) => (
                            <p
                                key={city.id}
                                onClick={() => {
                                    setSelectedCityId(city.id);
                                    setChosenCity?.(city);
                                }}
                                className={city.id === selectedCityId ? styles.cityItemActive : styles.cityItem}
                            >
                                {city.name}
                            </p>
                        ))}
                    </div>
                </div>

                <div className={styles.rightCol}>
                    <h3 className={styles.colTitle}>Кінотеатри</h3>
                    <div className={styles.list}>
                        {activeCity ? (
                            activeCity.cinemas && activeCity.cinemas.length > 0 ? (
                                activeCity.cinemas.map(cinema => (
                                    <p
                                        key={cinema.id}
                                        onClick={() => setChosenCinema?.(cinema)}
                                        className={styles.cinemaItem}
                                    >
                                        {cinema.name}
                                    </p>
                                ))
                            ) : (
                                <p className={styles.emptyText}>Немає кінотеатрів</p>
                            )
                        ) : (
                            <p className={styles.emptyText}>Виберіть місто ліворуч</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

