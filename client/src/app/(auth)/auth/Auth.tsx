'use client'
import { userService } from "@/api/user.service"
import styles from './style.module.css'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PAGES_URL } from "@/api/config"

export default function Auth() {

    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()
    const route = useRouter()

    const handleAuth = async () => {
        const payload = { email, password };

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
                        <label htmlFor=""><input placeholder="email" onChange={(e) => {
                            setEmail(e.target.value)

                        }} type="text" /></label>

                        <label htmlFor=""><input placeholder="password" onChange={(e) => {
                            setPassword(e.target.value)

                        }} type="text" /></label>
                        <button onClick={handleAuth}>Продовжити</button>

                    </div>

                </div>


                <div className={styles.images}>

                </div>

            </div>
        </>
    )
}
