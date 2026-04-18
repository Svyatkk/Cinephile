'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from './style.module.css'
import { IUser } from "@/types/user.interface";
import RegisterFilmPanel from "@/components/RegisterMoviePanel/RegisterMoviePanel";
export default function AdminPage() {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [admin, setAdmin] = useState<IUser | null>(null)

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
            <h1>Вітаємо {admin?.email} в системі управління Cinephile!</h1>



            <RegisterFilmPanel></RegisterFilmPanel>
        </div>
    )
}