'use client'
import { useState, useEffect, FormEvent } from 'react'
import styles from '../RegisterMoviePanel/style.module.css'
import { hallService } from '@/api/hall.service'
import { cinemaService } from '@/api/cinema.service'
import { ICinema } from '@/types/cinema.interface'

export default function RegisterHallPanel() {
    const [cinemas, setCinemas] = useState<ICinema[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const [formData, setFormData] = useState({
        cinema_id: '',
        name: '',
        technologies: '2D, 3D',
        rows_count: '10',
        seats_per_row: '12'
    })

    useEffect(() => {
        cinemaService.getAll().then(setCinemas).catch(console.error)
    }, [])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage({ type: '', text: '' })

        try {
            await hallService.create({
                cinema_id: Number(formData.cinema_id),
                name: formData.name,
                technologies: formData.technologies,
                rows_count: Number(formData.rows_count),
                seats_per_row: Number(formData.seats_per_row)
            })
            setMessage({ type: 'success', text: 'Зал успішно створено разом із місцями!' })
            setFormData({ ...formData, name: '' })
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Помилка при створенні залу' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Додати зал</h2>

            {message.text && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Кінотеатр *</label>
                    <select
                        required
                        value={formData.cinema_id}
                        onChange={(e) => setFormData({ ...formData, cinema_id: e.target.value })}
                    >
                        <option value="">Виберіть кінотеатр</option>
                        {cinemas.map(cinema => (
                            <option key={cinema.id} value={cinema.id}>{cinema.name} ({cinema.address})</option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Назва залу *</label>
                    <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Зал 1"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Технології</label>
                    <input
                        type="text"
                        value={formData.technologies}
                        onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                        placeholder="2D, 3D, IMAX"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Кількість рядів *</label>
                    <input
                        required
                        type="number"
                        value={formData.rows_count}
                        onChange={(e) => setFormData({ ...formData, rows_count: e.target.value })}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Місць у ряді *</label>
                    <input
                        required
                        type="number"
                        value={formData.seats_per_row}
                        onChange={(e) => setFormData({ ...formData, seats_per_row: e.target.value })}
                    />
                </div>

                <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                    {isLoading ? 'Збереження...' : 'Додати зал'}
                </button>
            </form>
        </div>
    )
}
