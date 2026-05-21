'use client'

import { useState, useEffect, FormEvent } from 'react'
import styles from '../RegisterMoviePanel/style.module.css'
import { movieService } from '@/api/movie.service'
import { hallService } from '@/api/hall.service'
import { sessionService } from '@/api/session.service'
import { cityService } from '@/api/city.service'
import { cinemaService } from '@/api/cinema.service'
import { IMovie } from '@/types/movie.interface'
import { IHall, ICity, ICinema } from '@/types/cinema.interface'
import SessionSchedule from '../SessionSchedule/SessionSchedule'

type HallSlot = {
    id: string
    cityId: string
    cinemaId: string
    hallId: string
}

type SubmitResult = {
    hallId: string
    hallName: string
    status: 'ok' | 'error'
    message: string
}

export default function RegisterSessionPanel() {
    const [movies, setMovies] = useState<IMovie[]>([])
    const [halls, setHalls] = useState<IHall[]>([])
    const [cities, setCities] = useState<ICity[]>([])
    const [cinemas, setCinemas] = useState<ICinema[]>([])

    const [formData, setFormData] = useState({
        movie_id: '',
        start_time: '',
        end_time: '',
        base_price: '',
        format: '2D',
        language_tag: 'UA',
    })

    const [hallSlots, setHallSlots] = useState<HallSlot[]>([
        { id: crypto.randomUUID(), cityId: '', cinemaId: '', hallId: '' }
    ])

    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState<SubmitResult[]>([])

    useEffect(() => {
        Promise.all([
            movieService.getAll(),
            cityService.getAll(),
            cinemaService.getAll(),
            hallService.getAll(),
        ]).then(([m, ci, cn, h]) => {
            setMovies(m)

            setCities(ci)
            setCinemas(cn)
            setHalls(h)
        }).catch(console.error)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => {
            const next = { ...prev, [name]: value }
            if ((name === 'start_time' || name === 'movie_id') && next.start_time && next.movie_id) {
                const movie = movies.find(m => m.id === Number(next.movie_id))
                if (movie?.duration_minutes) {
                    const end = new Date(new Date(next.start_time).getTime() + movie.duration_minutes * 60000)
                    next.end_time = [
                        end.getFullYear(),
                        String(end.getMonth() + 1).padStart(2, '0'),
                        String(end.getDate()).padStart(2, '0'),
                    ].join('-') + 'T' + [
                        String(end.getHours()).padStart(2, '0'),
                        String(end.getMinutes()).padStart(2, '0'),
                    ].join(':')
                }
            }
            return next
        })
    }

    const updateSlot = (id: string, field: keyof HallSlot, value: string) => {
        setHallSlots(prev => prev.map(slot => {
            if (slot.id !== id) return slot
            const next = { ...slot, [field]: value }
            if (field === 'cityId') { next.cinemaId = ''; next.hallId = '' }
            if (field === 'cinemaId') { next.hallId = '' }
            return next
        }))
    }

    const addSlot = () => {
        setHallSlots(prev => [...prev, { id: crypto.randomUUID(), cityId: '', cinemaId: '', hallId: '' }])
    }

    const removeSlot = (id: string) => {
        setHallSlots(prev => prev.filter(s => s.id !== id))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setResults([])

        const validSlots = hallSlots.filter(s => s.hallId)
        if (!validSlots.length) {
            setResults([{ hallId: '', hallName: '', status: 'error', message: 'Додайте хоча б один зал.' }])
            setIsLoading(false)
            return
        }

        const out: SubmitResult[] = []
        for (const slot of validSlots) {
            const hall = halls.find(h => h.id === Number(slot.hallId))
            try {
                await sessionService.create({
                    movie_id: Number(formData.movie_id),
                    hall_id: Number(slot.hallId),
                    start_time: formData.start_time.replace('T', ' '),
                    end_time: formData.end_time.replace('T', ' '),
                    base_price: Number(formData.base_price),
                    format: formData.format,
                    language_tag: formData.language_tag,
                } as any)
                out.push({ hallId: slot.hallId, hallName: hall?.name ?? slot.hallId, status: 'ok', message: 'Створено успішно' })
            } catch (err: any) {
                out.push({ hallId: slot.hallId, hallName: hall?.name ?? slot.hallId, status: 'error', message: err.message ?? 'Помилка' })
            }
        }

        setResults(out)
        if (out.every(r => r.status === 'ok')) {
            setFormData(prev => ({ ...prev, start_time: '', end_time: '' }))
            setHallSlots([{ id: crypto.randomUUID(), cityId: '', cinemaId: '', hallId: '' }])
        }
        setIsLoading(false)
    }

    const selectedMovie = movies.find(m => m.id === Number(formData.movie_id))


    return (
        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', width: '100%', justifyContent: 'center' }}>
            <div className={styles.container} style={{ flex: '1', maxWidth: '800px', margin: 0 }}>
                <h2 className={styles.title}>Додати сеанс</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Фільм *</label>
                        <select required name="movie_id" value={formData.movie_id} onChange={handleChange}>
                            <option value="">Виберіть фільм</option>
                            {movies.map(m => (
                                <option key={m.id} value={m.id}>{m.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Початок *</label>
                        <input required type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Кінець *</label>
                        <input required type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Ціна (базова) *</label>
                        <input required type="number" name="base_price" value={formData.base_price} onChange={handleChange} placeholder="150" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Формат</label>
                        <select name="format" value={formData.format} onChange={handleChange}>
                            <option value="2D">2D</option>
                            <option value="3D">3D</option>
                            <option value="IMAX">IMAX</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Мова</label>
                        <select name="language_tag" value={formData.language_tag} onChange={handleChange}>
                            <option value="UA">UA (Дубляж)</option>
                            <option value="EN">EN (Original)</option>
                            <option value="UA-Sub">UA (Субтитри)</option>
                        </select>
                    </div>

                    <div style={{ margin: '24px 0 8px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <label style={{ fontSize: '14px', fontWeight: 600 }}>Зали показу *</label>
                            <button type="button" onClick={addSlot} style={{
                                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '6px', color: '#fff', padding: '6px 14px', cursor: 'pointer', fontSize: '13px'
                            }}>
                                + Додати зал
                            </button>
                        </div>

                        {hallSlots.map((slot) => {
                            const usedHallIds = new Set(
                                hallSlots.filter(s => s.id !== slot.id && s.cinemaId === slot.cinemaId && s.hallId).map(s => s.hallId)
                            )
                            const availableHalls = halls
                                .filter(h => h.cinema_id === Number(slot.cinemaId))
                                .filter(h => !usedHallIds.has(String(h.id)))

                            return (
                                <div key={slot.id} style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px',
                                    alignItems: 'center', marginBottom: '10px',
                                    background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '12px'
                                }}>
                                    <select
                                        value={slot.cityId}
                                        onChange={e => updateSlot(slot.id, 'cityId', e.target.value)}
                                        style={{ background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '8px' }}
                                    >
                                        <option value="">МіМісто</option>
                                        {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>

                                    <select
                                        value={slot.cinemaId}
                                        onChange={e => updateSlot(slot.id, 'cinemaId', e.target.value)}
                                        disabled={!slot.cityId}
                                        style={{ background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '8px' }}
                                    >
                                        <option value="">Кінотеатр</option>
                                        {cinemas.filter(c => c.city_id === Number(slot.cityId)).map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={slot.hallId}
                                        onChange={e => updateSlot(slot.id, 'hallId', e.target.value)}
                                        disabled={!slot.cinemaId}
                                        style={{ background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '8px' }}
                                    >
                                        <option value="">Зал</option>
                                        {availableHalls.map(h => (
                                            <option key={h.id} value={h.id}>{h.name}</option>
                                        ))}
                                    </select>

                                    {hallSlots.length > 1 && (
                                        <button type="button" onClick={() => removeSlot(slot.id)} style={{
                                            background: 'rgba(220,50,50,0.15)', border: '1px solid rgba(220,50,50,0.3)',
                                            borderRadius: '6px', color: '#ff6b6b', padding: '8px 12px', cursor: 'pointer', fontSize: '16px'
                                        }}>✕</button>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                        {isLoading ? 'Збереження...' : `Створити сеанс (${hallSlots.filter(s => s.hallId).length} ${hallSlots.filter(s => s.hallId).length === 1 ? 'зал' : 'зали'})`}
                    </button>
                </form>

                {results.length > 0 && (
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {results.map((r, i) => (
                            <div key={i} style={{
                                padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
                                background: r.status === 'ok' ? 'rgba(50,200,80,0.1)' : 'rgba(220,50,50,0.1)',
                                border: `1px solid ${r.status === 'ok' ? 'rgba(50,200,80,0.3)' : 'rgba(220,50,50,0.3)'}`,
                                color: r.status === 'ok' ? '#5eff8a' : '#ff6b6b',
                            }}>
                                {r.status === 'ok' ? '✓' : '✗'} <strong>{r.hallName}</strong> — {r.message}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedMovie && (() => {
                const uniqueCinemaIds = [...new Set(
                    hallSlots.filter(s => s.cinemaId).map(s => Number(s.cinemaId))
                )]
                if (!uniqueCinemaIds.length) return null
                return (
                    <div style={{
                        flex: '1',
                        maxWidth: '500px',
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(10px)',
                        padding: '24px',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '32px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                        }}>
                            Існуючі сеанси у вибраних кінотеатрах
                        </div>
                        {uniqueCinemaIds.map(cinemaId => {
                            const cinema = cinemas.find(c => c.id === cinemaId)
                            return (
                                <div key={cinemaId}>
                                    <div style={{
                                        fontSize: '15px', fontWeight: 600, color: '#fff',
                                        marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px'
                                    }}>
                                        <span style={{
                                            width: '8px', height: '8px', borderRadius: '50%',
                                            background: '#e00', display: 'inline-block', flexShrink: 0
                                        }} />
                                        {cinema?.name ?? `Кінотеатр ${cinemaId}`}
                                    </div>
                                    <SessionSchedule
                                        movieId={Number(formData.movie_id)}
                                        cinemaId={cinemaId}
                                        isAdmin={true}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )
            })()}
        </div>
    )
}
