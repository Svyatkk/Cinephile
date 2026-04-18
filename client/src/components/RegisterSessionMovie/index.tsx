'use client'
import React, { useState, useEffect } from 'react';
import style from './style.module.css';
import { IHall } from '@/types/cinema.interface';
import { ISession } from '@/types/session.interface';
import { IMovie } from '@/types/movie.interface';
import { sessionService } from '@/api/session.service';

// Мокові дані для прикладу (в реальному додатку отримуються з бекенду)
const mockHalls: IHall[] = [
    { id: 1, cinema_id: 1, name: 'Зал 1', technologies: '2D' },
    { id: 2, cinema_id: 1, name: 'Зал 2', technologies: '3D' },
    { id: 3, cinema_id: 2, name: 'IMAX Зал', technologies: 'IMAX' },
];

const mockMovies: IMovie[] = [
    { id: 1, title: 'Дюна: Частина друга', duration_minutes: 166 },
    { id: 2, title: 'Дедпул і Росомаха', duration_minutes: 127 },
];

interface Props {
    movieId?: number; // Якщо передається, то сеанс реєструється саме для цього фільму
    onSessionCreated?: (session: ISession) => void;
}

export default function RegisterSessionMovie({ movieId, onSessionCreated }: Props) {
    
    const [selectedMovie, setSelectedMovie] = useState<number | ''>(movieId || '');
    const [selectedHall, setSelectedHall] = useState<number | ''>('');
    const [date, setDate] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [basePrice, setBasePrice] = useState<number | ''>('');
    const [format, setFormat] = useState<string>('2D');
    const [languageTag, setLanguageTag] = useState<string>('UA');
    
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);

    // Автоматичний розрахунок end_time на основі тривалості фільму
    useEffect(() => {
        if (selectedMovie && startTime && date) {
            const movie = mockMovies.find(m => m.id === Number(selectedMovie));
            if (movie && movie.duration_minutes) {
                const startDateTime = new Date(`${date}T${startTime}`);
                const endDateTime = new Date(startDateTime.getTime() + movie.duration_minutes * 60000);
                
                const endHours = String(endDateTime.getHours()).padStart(2, '0');
                const endMinutes = String(endDateTime.getMinutes()).padStart(2, '0');
                setEndTime(`${endHours}:${endMinutes}`);
            }
        }
    }, [selectedMovie, startTime, date]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!selectedMovie || !selectedHall || !date || !startTime || !endTime || !basePrice) {
            setError('Заповніть всі обов\'язкові поля');
            return;
        }

        const startDateTime = new Date(`${date}T${startTime}`);
        const endDateTime = new Date(`${date}T${endTime}`);

        const newSession: ISession = {
            movie_id: Number(selectedMovie),
            hall_id: Number(selectedHall),
            start_time: startDateTime.toISOString().slice(0, 19).replace('T', ' '),
            end_time: endDateTime.toISOString().slice(0, 19).replace('T', ' '),
            base_price: Number(basePrice),
            format,
            language_tag: languageTag
        };

        try {
            await sessionService.create(newSession);
            setSuccess(true);
            if (onSessionCreated) {
                onSessionCreated(newSession);
            }
            // Очищення форми
            setStartTime('');
            setEndTime('');
            setBasePrice('');
        } catch (err: any) {
            setError(err.message || 'Помилка при створенні сеансу');
        }
    }

    return (
        <div className={style.container}>
            <h2 className={style.title}>Створення нового сеансу</h2>
            
            {error && <div className={style.error}>{error}</div>}
            {success && <div className={style.success}>Сеанс успішно створено!</div>}
            
            <form onSubmit={handleSubmit} className={style.form}>
                {!movieId && (
                    <div className={style.formGroup}>
                        <label>Фільм</label>
                        <select 
                            value={selectedMovie} 
                            onChange={(e) => setSelectedMovie(Number(e.target.value))}
                            className={style.input}
                        >
                            <option value="">Оберіть фільм</option>
                            {mockMovies.map(m => (
                                <option key={m.id} value={m.id}>{m.title}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className={style.row}>
                    <div className={style.formGroup}>
                        <label>Зала</label>
                        <select 
                            value={selectedHall} 
                            onChange={(e) => setSelectedHall(Number(e.target.value))}
                            className={style.input}
                        >
                            <option value="">Оберіть залу</option>
                            {mockHalls.map(h => (
                                <option key={h.id} value={h.id}>{h.name} ({h.technologies})</option>
                            ))}
                        </select>
                    </div>

                    <div className={style.formGroup}>
                        <label>Дата</label>
                        <input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)}
                            className={style.input}
                        />
                    </div>
                </div>

                <div className={style.row}>
                    <div className={style.formGroup}>
                        <label>Час початку</label>
                        <input 
                            type="time" 
                            value={startTime} 
                            onChange={(e) => setStartTime(e.target.value)}
                            className={style.input}
                        />
                    </div>

                    <div className={style.formGroup}>
                        <label>Час закінчення</label>
                        <input 
                            type="time" 
                            value={endTime} 
                            onChange={(e) => setEndTime(e.target.value)}
                            className={style.input}
                        />
                    </div>
                </div>

                <div className={style.row}>
                    <div className={style.formGroup}>
                        <label>Базова ціна (грн)</label>
                        <input 
                            type="number" 
                            value={basePrice} 
                            onChange={(e) => setBasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                            className={style.input}
                            min="0"
                        />
                    </div>

                    <div className={style.formGroup}>
                        <label>Формат</label>
                        <select 
                            value={format} 
                            onChange={(e) => setFormat(e.target.value)}
                            className={style.input}
                        >
                            <option value="2D">2D</option>
                            <option value="3D">3D</option>
                            <option value="IMAX">IMAX</option>
                        </select>
                    </div>

                    <div className={style.formGroup}>
                        <label>Мова</label>
                        <select 
                            value={languageTag} 
                            onChange={(e) => setLanguageTag(e.target.value)}
                            className={style.input}
                        >
                            <option value="UA">UA (Українська)</option>
                            <option value="EN">EN (Англійська)</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className={style.submitBtn}>
                    Зареєструвати сеанс
                </button>
            </form>
        </div>
    );
}