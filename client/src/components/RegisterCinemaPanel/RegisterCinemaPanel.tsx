'use client'

import { useState, useEffect, FormEvent } from 'react'
import styles from '../RegisterMoviePanel/style.module.css'
import { cinemaService } from '@/api/cinema.service'
import { cityService } from '@/api/city.service'
import { ICity, ICinema } from '@/types/cinema.interface'

export default function RegisterCinemaPanel() {
    const [cities, setCities] = useState<ICity[]>([])
    const [allCinemas, setAllCinemas] = useState<ICinema[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const [formData, setFormData] = useState({
        name: '',
        city_id: '',
        address: ''
    })

    useEffect(() => {
        Promise.all([
            cityService.getAll(),
            cinemaService.getAll()
        ]).then(([c, cn]) => {
            setCities(c)
            setAllCinemas(cn)
        }).catch(console.error)
    }, [])

    const cinemasInSelectedCity = formData.city_id
        ? allCinemas.filter(c => c.city_id === Number(formData.city_id))
        : []

    const isDuplicateName = formData.name.trim() !== '' &&
        cinemasInSelectedCity.some(c => c.name.trim().toLowerCase() === formData.name.trim().toLowerCase())

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (isDuplicateName) {
            setMessage({ type: 'error', text: `Кінотеатр з назвою "${formData.name}" вже існує у цьому місті.` })
            return
        }
        setIsLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const created = await cinemaService.create({
                name: formData.name,
                city_id: Number(formData.city_id),
                address: formData.address
            })
            setMessage({ type: 'success', text: 'Кінотеатр успішно додано!' })
            setAllCinemas(prev => [...prev, { ...created, city_id: Number(formData.city_id) }])
            setFormData({ name: '', city_id: formData.city_id, address: '' })
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
                        style={isDuplicateName ? { borderColor: '#e00' } : undefined}
                    />
                    {isDuplicateName && (
                        <span style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                            Кінотеатр з такою назвою вже існує у цьому місті
                        </span>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label>Місто *</label>
                    <select
                        required
                        value={formData.city_id}
                        onChange={(e) => setFormData({ ...formData, city_id: e.target.value, name: '' })}
                    >
                        <option value="">Виберіть місто</option>
                        {cities.map(city => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                    </select>
                </div>

                {formData.city_id && cinemasInSelectedCity.length > 0 && (
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                            Вже існуючі кінотеатри у цьому місті:
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {cinemasInSelectedCity.map(c => (
                                <span key={c.id} style={{
                                    padding: '4px 10px', borderRadius: '4px', fontSize: '12px',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    color: 'rgba(255,255,255,0.7)'
                                }}>
                                    {c.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

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

                <button type="submit" disabled={isLoading || isDuplicateName} className={styles.submitBtn}>
                    {isLoading ? 'Збереження...' : 'Додати кінотеатр'}
                </button>
            </form>
        </div>
    )
}
