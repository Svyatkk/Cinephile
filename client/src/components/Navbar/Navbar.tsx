'use client'
import styles from './style.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import SideBar from '../SideBar/SideBar'
import { useRouter } from 'next/navigation'
import { PAGES_URL } from '@/api/config'
import { userService } from '@/api/user.service'
import { IUser } from '@/types/user.interface'
export default function NavBar() {

    const [active, setActive] = useState<boolean>(false)
    const route = useRouter()
    const [user, setUser] = useState<IUser | null>(null)

    useEffect(() => {

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [])


    return (
        <>
            <nav className={styles.nav}>

                <div className={styles.firstBlock}>
                    <div
                        onClick={() => {

                            setActive(prev => !prev)

                        }}
                        className={`${styles.hamMenu} ${active ? styles.active : ''}`}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <div className={styles.logo}>
                        <p onClick={() => route.push(PAGES_URL.MAIN)}>Cinephile</p>
                    </div>

                </div>

                <div className={styles.block}>


                    {
                        user ?
                            (
                                <Link href={PAGES_URL.ACCOUNT} className={styles.login}>
                                    <p>Мій кабінет</p>
                                    <Image
                                        src="/profileImg.svg"
                                        alt="Іконка профілю"
                                        width={30}
                                        height={30}
                                        className={styles.icon}
                                    />
                                </Link>
                            )
                            :
                            (
                                <Link href={PAGES_URL.AUTH} className={styles.login}>
                                    <p>Увійти</p>
                                    <Image
                                        src="/profileImg.svg"
                                        alt="Іконка профілю"
                                        width={30}
                                        height={30}
                                        className={styles.icon}
                                    />
                                </Link>
                            )
                    }

                </div>

                <SideBar active={active}></SideBar>

                <div className={`${styles.blockTrans} ${active ? styles.active : ''}`}>


                </div>

            </nav >
        </>
    )
}