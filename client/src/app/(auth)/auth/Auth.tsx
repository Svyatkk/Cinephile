'use client'
import { userService } from '@/api/user.service'
import styles from './style.module.css'
import { useRef } from "react"
import { useRouter } from "next/navigation"
import { PAGES_URL } from "@/api/config"
import Link from 'next/link'
export default function Auth() {

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const route = useRouter()


    const handleAuth = async () => {
        const payload = {
            email: emailRef.current?.value,
            password: passwordRef.current?.value
        };


        try {
            const response = await userService.auth(payload);

            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));

                if (response.user.role === 'admin') {
                    route.push(PAGES_URL.ADMIN);
                } else {
                    route.push(PAGES_URL.MAIN);
                }
                route.refresh();
            }

        } catch (error) {
            console.log('Помилка авторизації:', error);

        }
    }

    return (
        <>
            <div className={styles.block}>

                <div className={styles.auth}>
                    <div className={styles.blockAuth}>
                        <div className={styles.blockText}>
                            <h1>Вхід до особистого кабінету
                            </h1>
                            <p>Тут всі ваші замовлення та особиста інформація

                            </p>
                        </div>

                        <label htmlFor=""><input suppressHydrationWarning ref={emailRef} placeholder="Email" type="text" /></label>


                        <label htmlFor=""><input suppressHydrationWarning ref={passwordRef} placeholder="Пароль" type="password" /></label>
                        <button suppressHydrationWarning onClick={handleAuth}>Продовжити</button>

                        <div className={styles.return}>
                            Повернутися на сайт <Link className={styles.link} href={PAGES_URL.MAIN}>Cinephile</Link>
                        </div>

                    </div>

                </div>


                <div className={styles.images}>

                </div>

            </div>
        </>
    )
}
