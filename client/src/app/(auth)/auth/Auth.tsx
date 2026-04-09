'use client'
import { userService } from "@/api/user.serice"
import styles from './style.module.css'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PAGES_URL } from "@/api/config"

export default function Auth() {

    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()
    const route = useRouter()

    const handleAuth = async () => {

        const payload = {
            email, password
        }
        try {
            await userService.auth(payload)
            route.push('/')
            route.refresh()

        } catch (error) {
            console.log(error)
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
