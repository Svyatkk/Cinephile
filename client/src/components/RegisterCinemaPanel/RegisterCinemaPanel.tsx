'use client'
import { useState, useEffect, FormEvent } from 'react'
import styles from '../RegisterMoviePanel/style.module.css'
import { cinemaService } from '@/api/cinema.service'
import { cityService } from '@/api/city.service'
import { ICity } from '@/types/cinema.interface'

export default function RegisterCinemaPanel() {
    const [cities, setCities] = useState<ICity[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const [formData, setFormData] = useState({
        name: '',
        city_id: '',
        address: ''
    })

    useEffect(() => {
        cityService.getAll().then(setCities).catch(console.error)
    }, [])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage({ type: '', text: '' })

        try {
            await cinemaService.create({
                name: formData.name,
                city_id: Number(formData.city_id),
                address: formData.address
            })
            setMessage({ type: 'success', text: 'Кінотеатр успішно додано!' })
            setFormData({ name: '', city_id: '', address: '' })
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Помилка при додаванні кінотеатру' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Додати кінотеатр</h2>

            {message.text && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Назва кінотеатру *</label>
                    <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Multiplex"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Місто *</label>
                    <select
                        required
                        value={formData.city_id}
                        onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                    >
                        <option value="">Виберіть місто</option>
                        {cities.map(city => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                    </select>
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Адреса *</label>
                    <input
                        required
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="вул. Хрещатик, 1"
                    />
                </div>

                <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                    {isLoading ? 'Збереження...' : 'Додати кінотеатр'}
                </button>
            </form>
        </div>
    )
}
