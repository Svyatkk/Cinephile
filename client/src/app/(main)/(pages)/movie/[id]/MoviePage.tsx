'use client'
import { useEffect, useState } from "react"
import { movieService } from '@/api/movie.service'
import { IMovie } from '@/types/movie.interface'
import styles from './style.module.css'
type Props = {
    id: string
}

export default function MoviePage({ id }: Props) {
    const [movie, setMovie] = useState<IMovie | null>(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        movieService.getById(id).then(res => {
            setMovie(res)
            setLoaded(true)
        })
    }, [id])

    if (!loaded) return <MovieSkeleton />
    if (!movie) return null

    const genres = movie.genres?.split(',').map(g => g.trim()) ?? []

    return (
        <div className={styles.page}>
            <div className={styles.hero}>
                {movie.poster_url && (
                    <img src={movie.poster_url} alt={movie.title} className={styles.heroBg} />
                )}
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <div className={styles.posterWrap}>
                        {movie.poster_url ? (
                            <img src={movie.poster_url} alt={movie.title} className={styles.poster} />
                        ) : (
                            <div className={styles.posterPlaceholder}>
                                <span className={styles.posterPlaceholderText}>🎬</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.heroMeta}>
                        {movie.age_restriction && (
                            <span className={styles.ageBadge}>{movie.age_restriction}</span>
                        )}
                        <h1 className={styles.title}>{movie.title}</h1>
                        {movie.original_title && movie.original_title !== movie.title && (
                            <p className={styles.originalTitle}>{movie.original_title}</p>
                        )}
                        <div className={styles.tagRow}>
                            {movie.release_year && <span className={styles.tag}>{movie.release_year}</span>}
                            {movie.duration_minutes && (
                                <span className={styles.tag}>{formatDuration(movie.duration_minutes)}</span>
                            )}
                            {movie.language && <span className={styles.tag}>{movie.language}</span>}
                            {genres.map(g => (
                                <span key={g} className={styles.tagAccent}>{g}</span>
                            ))}
                        </div>

                        <button className={styles.buyBtn}>
                            <span className={styles.buyBtnIcon}>▶</span>
                            Купити квиток
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.body}>
                {movie.description && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Про фільм</h2>
                        <p className={styles.description}>{movie.description}</p>
                    </section>
                )}

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Деталі</h2>
                    <div className={styles.detailGrid}>
                        {movie.director && <DetailItem label="Режисер" value={movie.director} />}
                        {movie.country && <DetailItem label="Країна" value={movie.country} />}
                        {movie.studio && <DetailItem label="Студія" value={movie.studio} />}
                        {movie.release_year && <DetailItem label="Рік" value={String(movie.release_year)} />}
                        {movie.duration_minutes && <DetailItem label="Тривалість" value={formatDuration(movie.duration_minutes)} />}
                        {movie.language && <DetailItem label="Оригінальна мова" value={movie.language} />}
                    </div>
                </section>


                {movie.cast_actors && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>У ролях</h2>
                        <div className={styles.castGrid}>
                            {movie.cast_actors.split(',').map(actor => actor.trim()).map(actor => (
                                <div key={actor} className={styles.castChip}>
                                    <div className={styles.castAvatar}>{actor.charAt(0)}</div>
                                    <span className={styles.castName}>{actor}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className={styles.ctaSection}>
                    <p className={styles.ctaText}>Обирайте сеанс та насолоджуйтесь переглядом у кінотеатрі!</p>
                    <button className={styles.buyBtnLarge}>
                        Купити квиток на сеанс
                    </button>
                </section>
            </div>
        </div>
    )
}

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <div className={styles.detailItem}>
            <span className={styles.detailLabel}>{label}</span>
            <span className={styles.detailValue}>{value}</span>
        </div>
    )
}

function MovieSkeleton() {
    return (
        <div className={styles.page}>
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.posterPlaceholder} />
                    <div className={styles.heroMeta}>
                        <div style={skeletonBlock(200, 16)} />
                        <div style={{ ...skeletonBlock(320, 40), marginTop: 12 }} />
                        <div style={{ ...skeletonBlock(200, 20), marginTop: 12 }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function skeletonBlock(w: number, h: number) {
    return {
        width: w, height: h,
        borderRadius: 6,
        background: '#222',
        animation: 'pulse 1.5s infinite ease-in-out',
    }
}

function formatDuration(mins: number) {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return h > 0 ? `${h} год ${m} хв` : `${m} хв`
}
