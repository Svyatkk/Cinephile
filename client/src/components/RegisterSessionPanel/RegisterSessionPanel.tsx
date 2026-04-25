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




export default function RegisterSessionPanel() {
    const [movies, setMovies] = useState<IMovie[]>([])
    const [halls, setHalls] = useState<IHall[]>([])
    const [cities, setCities] = useState<ICity[]>([])
    const [cinemas, setCinemas] = useState<ICinema[]>([])
    const [selectedCity, setSelectedCity] = useState('')
    const [selectedCinema, setSelectedCinema] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [formData, setFormData] = useState({
        movie_id: '',
        hall_id: '',
        start_time: '',
        end_time: '',
        base_price: '',
        format: '2D',
        language_tag: 'UA'
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [moviesData, citiesData, cinemasData, hallsData] = await Promise.all([
                    movieService.getAll(),
                    cityService.getAll(),
                    cinemaService.getAll(),
                    hallService.getAll()
                ])
                setMovies(moviesData)
                setCities(citiesData)
                setCinemas(cinemasData)
                setHalls(hallsData)
            } catch (error) {
                console.error("Помилка при завантаженні даних:", error)
            }
        }
        fetchData()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const selectedMovie = movies?.find(m => m.id === Number(formData.movie_id)) || undefined;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage({ type: '', text: '' })

        try {
            await sessionService.create({
                movie_id: Number(formData.movie_id),
                hall_id: Number(formData.hall_id),
                start_time: formData.start_time.replace('T', ' '),
                end_time: formData.end_time.replace('T', ' '),
                base_price: Number(formData.base_price),
                format: formData.format,
                language_tag: formData.language_tag
            } as any)

            setMessage({ type: 'success', text: 'Сеанс успішно створено!' })
            setFormData(prev => ({ ...prev, start_time: '', end_time: '' }))
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Помилка при створенні сеансу' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Додати сеанс</h2>

            {message.text && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Фільм *</label>
                    <select required name="movie_id" value={formData.movie_id} onChange={handleChange}>
                        <option value="">Виберіть фільм</option>
                        {movies.map(movie => (
                            <option key={movie.id} value={movie.id}>{movie.title}</option>
                        ))}
                    </select>
                </div>



                <div className={styles.formGroup}>
                    <label>Місто</label>
                    <select value={selectedCity} onChange={(e) => {
                        setSelectedCity(e.target.value);
                        setSelectedCinema('');
                        setFormData(prev => ({ ...prev, hall_id: '' }));
                    }}>
                        <option value="">Виберіть місто</option>
                        {cities.map(city => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                    </select>
                </div>



                <div className={styles.formGroup}>
                    <label>Кінотеатр</label>
                    <select
                        value={selectedCinema}
                        onChange={(e) => {
                            setSelectedCinema(e.target.value);
                            setFormData(prev => ({ ...prev, hall_id: '' }));
                        }}
                        disabled={!selectedCity}
                    >
                        <option value="">Виберіть кінотеатр</option>
                        {cinemas
                            .filter(cinema => cinema.city_id === Number(selectedCity))
                            .map(cinema => (
                                <option key={cinema.id} value={cinema.id}>{cinema.name}</option>
                            ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Зал *</label>
                    <select
                        required
                        name="hall_id"
                        value={formData.hall_id}
                        onChange={handleChange}
                        disabled={!selectedCinema}
                    >
                        <option value="">Виберіть зал</option>
                        {halls
                            .filter(hall => hall.cinema_id === Number(selectedCinema))
                            .map(hall => (
                                <option key={hall.id} value={hall.id}>{hall.name}</option>
                            ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Початок *</label>
                    <input
                        required
                        type="datetime-local"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Кінець *</label>
                    <input
                        required
                        type="datetime-local"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Ціна (базова) *</label>
                    <input
                        required
                        type="number"
                        name="base_price"
                        value={formData.base_price}
                        onChange={handleChange}
                        placeholder="150"
                    />
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

                <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                    {isLoading ? 'Збереження...' : 'Створити сеанс'}
                </button>
            </form >


            {selectedMovie && (
                <div style={{ marginTop: '40px', width: '100%' }}>
                    <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '20px' }}>
                        Існуючі сеанси для цього фільму
                    </h3>


                    <div style={{ width: '100%', maxWidth: 'none' }}>
                        <SessionSchedule movieId={Number(formData.movie_id)} />
                    </div>
                </div>
            )}
        </div >
    )
}
