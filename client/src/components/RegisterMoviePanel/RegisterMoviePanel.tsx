'use client'
import styles from './style.module.css'
import { useState, ChangeEvent, FormEvent } from 'react'
import { IMovie } from '@/types/movie.interface'
import { movieService } from '@/api/movie.service'
import { BASE_URL } from '@/api/config'

export default function RegisterFilmPanel() {
    const [formData, setFormData] = useState<IMovie>({
        title: '',
        original_title: '',
        description: '',
        poster_url: '',
        release_year: undefined,
        duration_minutes: undefined,
        genres: '',
        director: '',
        cast_actors: '',
        country: '',
        studio: '',
        language: '',
        age_restriction: '',
        inclusive_adaptation: 0
    });


    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked ? 1 : 0 }));
            return;
        }

        const parsedValue = type === 'number' ? (value === '' ? undefined : Number(value)) : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            let finalPosterUrl = formData.poster_url;

            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('poster', selectedFile);

                const uploadRes = await fetch(`${BASE_URL}/upload`, {
                    method: 'POST',
                    body: uploadData,
                });

                if (!uploadRes.ok) throw new Error('Не вдалося завантажити постер на сервер');

                const uploadResult = await uploadRes.json();
                finalPosterUrl = uploadResult.url;
            }

            const movieDataToSubmit = { ...formData, poster_url: finalPosterUrl };
            await movieService.create(movieDataToSubmit);

            setMessage({ type: 'success', text: 'Фільм успішно додано до бази!' });

            setFormData({
                title: '', original_title: '', description: '', poster_url: '',
                release_year: undefined, duration_minutes: undefined, genres: '',
                director: '', cast_actors: '', country: '', studio: '',
                language: '', age_restriction: '', inclusive_adaptation: 0
            });
            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Помилка при додаванні фільму. Перевірте дані.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h2 className={styles.title}>Додати новий фільм</h2>

                {message.text && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Назва фільму *</label>
                        <input required type="text" name="title" value={formData.title ?? ''} onChange={handleChange} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Оригінальна назва</label>
                        <input type="text" name="original_title" value={formData.original_title ?? ''} onChange={handleChange} />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label>Опис фільму</label>
                        <textarea rows={4} name="description" value={formData.description ?? ''} onChange={handleChange} placeholder="Короткий сюжет..."></textarea>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Рік випуску</label>
                        <input type="number" name="release_year" value={formData.release_year ?? ''} onChange={handleChange} placeholder="2010" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Тривалість (хвилин)</label>
                        <input type="number" name="duration_minutes" value={formData.duration_minutes ?? ''} onChange={handleChange} placeholder="148" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Жанри</label>
                        <input type="text" name="genres" value={formData.genres ?? ''} onChange={handleChange} placeholder="Фантастика, Бойовик" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Режисер</label>
                        <input type="text" name="director" value={formData.director ?? ''} onChange={handleChange} placeholder="Крістофер Нолан" />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label>Актори (через кому)</label>
                        <input type="text" name="cast_actors" value={formData.cast_actors ?? ''} onChange={handleChange} placeholder="Леонардо Ді Капріо, Джозеф Гордон-Левітт..." />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Країна</label>
                        <input type="text" name="country" value={formData.country ?? ''} onChange={handleChange} placeholder="США, Велика Британія" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Студія</label>
                        <input type="text" name="studio" value={formData.studio ?? ''} onChange={handleChange} placeholder="Warner Bros." />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Мова оригіналу</label>
                        <input type="text" name="language" value={formData.language ?? ''} onChange={handleChange} placeholder="Англійська" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Вікове обмеження</label>
                        <select name="age_restriction" value={formData.age_restriction ?? ''} onChange={handleChange}>
                            <option value="">Без обмежень</option>
                            <option value="0+">0+</option>
                            <option value="12+">12+</option>
                            <option value="16+">16+</option>
                            <option value="18+">18+</option>
                        </select>
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label>Постер фільму</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        {previewUrl && (
                            <div style={{ marginTop: '10px' }}>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    style={{ width: '150px', height: 'auto', borderRadius: '8px', objectFit: 'cover' }}
                                />
                            </div>
                        )}

                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                            Або введіть URL вручну:
                        </div>
                        <input
                            type="text"
                            name="poster_url"
                            value={formData.poster_url ?? ''}
                            onChange={handleChange}
                            placeholder="https://example.com/poster.jpg"
                            disabled={!!selectedFile}
                        />
                    </div>

                    <div className={`${styles.formGroup} ${styles.checkboxGroup} ${styles.fullWidth}`}>
                        <input
                            type="checkbox"
                            id="inclusive"
                            name="inclusive_adaptation"
                            checked={formData.inclusive_adaptation === 1}
                            onChange={handleChange}
                        />
                        <label htmlFor="inclusive">Є інклюзивна адаптація (тифлокоментар/субтитри)</label>
                    </div>

                    <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                        {isLoading ? 'Збереження...' : 'Додати фільм'}
                    </button>
                </form>
            </div>
        </div>
    )
}