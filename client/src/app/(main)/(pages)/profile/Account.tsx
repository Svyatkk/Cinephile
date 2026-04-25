'use client'
import { useEffect, useState } from "react"
import { IUser } from "@/types/user.interface"
import styles from './style.module.css'
import { PAGES_URL } from "@/api/config"
import Link from "next/link"
import Image from "next/image"

export default function Account() {

    const [user, setUser] = useState<IUser | null>(null)

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [])


    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {
                    user ? (
                        <div className={styles.cabinetBox}>
                            <h1>Особистий кабінет</h1>
                            <div className={styles.userInfo}>
                                <div className={styles.avatar}>
                                    <Image src="/profileImg.svg" width={60} height={60} alt="Avatar" className={styles.avatarImg} />
                                </div>
                                <div className={styles.details}>
                                    <div className={styles.field}>
                                        <span className={styles.label}>Email</span>
                                        <span className={styles.value}>{user.email}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.orders}>
                                <h2>Ваші квитки</h2>
                                <p className={styles.emptyOrders}>У вас поки немає замовлень</p>
                            </div>
                        </div>

                    ) : (
                        <div className={styles.authPrompt}>
                            <h1>УПС...</h1>
                            <p>Для перегляду особистого кабінету спочатку увійдіть в акаунт</p>
                            <Link href={PAGES_URL.AUTH} className={styles.loginBtn}>Увійти</Link>
                        </div>
                    )
                }



                {
                    user && user.role === 'admin' && (
                        <div className={styles.adminPanel}>
                            <h2>Адмін панель</h2>
                            <div className={styles.adminLinks}>
                                <Link href={PAGES_URL.ADMIN} className={styles.adminLink}>Перейти в адмін панель</Link>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}