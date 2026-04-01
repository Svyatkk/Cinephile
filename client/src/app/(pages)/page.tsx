"use client";

import { useEffect, useState } from "react";
import styles from './page.module.css'
import { useRouter } from "next/navigation";

interface Movie {
    id: number;
    title: string;
}

interface ApiResponse {
    message: string;
    data: Movie[];
}




export default function Home() {
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const route = useRouter()

    useEffect(() => {
        fetch("/api/index.php")
            .then((res) => res.json())
            .then((json) => {
                setData(json);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Помилка завантаження:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className={styles.pageMain}>
            <h1>Cinephile Project</h1>

            <div className={styles.block}>
                {loading ? (
                    <p>Завантаження даних з PHP...</p>
                ) : (
                    <div>
                        <p style={{ color: "green", fontWeight: "bold" }}>
                            {data?.message}
                        </p>

                        <h3>Список фільмів з бази (тестовий):</h3>
                        <ul>
                            {data?.data?.map((movie) => (
                                <li key={movie.id}>{movie.title}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>


            <div className={styles.login}>
                <button onClick={() => {
                    route.push('/login')
                }}>Login</button>
            </div>

            <div className={styles.block}>
                Дані отримані успішно! Це Fullstack додаток.
            </div>
        </div>
    );
}