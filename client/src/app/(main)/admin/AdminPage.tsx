'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from './style.module.css'
import { IUser } from "@/types/user.interface";
import RegisterFilmPanel from "@/components/RegisterMoviePanel/RegisterMoviePanel";
import RegisterSessionPanel from "@/components/RegisterSessionPanel/RegisterSessionPanel";
import RegisterCityPanel from "@/components/RegisterCityPanel/RegisterCityPanel";

export default function AdminPage() {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [admin, setAdmin] = useState<IUser | null>(null)
    const [activeTab, setActiveTab] = useState<'film' | 'session' | 'city'>('film')

    const route = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem('user');

        if (userStr) {
            const user = JSON.parse(userStr);

            if (user.role === 'admin') {
                setIsAuthorized(true);
                setAdmin(user)
                return;
            }
        }
        route.push('/');
    }, [route]);


    if (!isAuthorized) return null;


    return (
        <div className={styles.page}>
            <h1 className={styles.adminTitle}>Система управління Cinephile</h1>
            
            <div className={styles.tabs}>
                <button 
                    className={`${styles.tabBtn} ${activeTab === 'film' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('film')}
                >
                    Фільми
                </button>
                <button 
                    className={`${styles.tabBtn} ${activeTab === 'session' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('session')}
                >
                    Сеанси
                </button>
                <button 
                    className={`${styles.tabBtn} ${activeTab === 'city' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('city')}
                >
                    Міста
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'film' && <RegisterFilmPanel />}
                {activeTab === 'session' && <RegisterSessionPanel />}
                {activeTab === 'city' && <RegisterCityPanel />}
            </div>
        </div>
    )
}