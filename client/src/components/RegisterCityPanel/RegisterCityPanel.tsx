'use client'
import { useState, FormEvent } from 'react'
import styles from '../RegisterMoviePanel/style.module.css'
import { cityService } from '@/api/city.service'

export default function RegisterCityPanel() {
    const [cityName, setCityName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!cityName.trim()) return

        setIsLoading(true)
        setMessage({ type: '', text: '' })

        try {
            await cityService.create(cityName)
            setMessage({ type: 'success', text: 'Місто успішно додано!' })
            setCityName('')
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Помилка при додаванні міста' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Додати нове місто</h2>

            {message.text && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Назва міста *</label>
                    <input
                        required
                        type="text"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        placeholder="Київ"
                    />
                </div>

                <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                    {isLoading ? 'Збереження...' : 'Додати місто'}
                </button>
            </form>
        </div>
    )
}
