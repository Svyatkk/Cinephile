'use client'

import { useEffect, useState } from 'react'
import style from './style.module.css'
import { useRouter } from 'next/navigation'
import { PAGES_URL } from '@/api/config'
import Link from 'next/link'
import { IUser } from '@/types/user.interface'
import Image from 'next/image'
type Props = {
    active: boolean
}


export default function SideBar({ active }: Props) {

    const route = useRouter()


    const [user, setUser] = useState<boolean>()

    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user) {
            setUser(true)
        }
    }, [])


    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = PAGES_URL.MAIN;
        setUser(false)
    }


    return (
        <>


            <div className={`${style.sideBar} ${active ? style.open : ''}`}>

                <div className={style.blocks}>


                    <div className={style.links}>
                        <Link className={style.link} href={PAGES_URL.MAIN}>Скоро у прокаті</Link>
                        <Link className={style.link} href={PAGES_URL.MAIN}>Кінотеатри</Link>
                        <Link className={style.link} href={PAGES_URL.MAIN}>Про компанію</Link>
                        <Link className={style.link} href={PAGES_URL.MAIN}>Акції ти знижки</Link>
                    </div>

                    <div className={style.logout}>
                        <span>{user ? "Особистий кабінет" : "Увійдіть в акаунт"}</span>

                        <Link href={user ? PAGES_URL.ACCOUNT : PAGES_URL.AUTH}
                            className={style.login}>

                            <Image
                                src="/profileImg.svg"
                                alt="Іконка профілю"
                                width={20}
                                height={20}
                                className={style.icon}
                            />
                            {user ? "Вийти" : "Увійти"}

                        </Link>
                    </div>


                    <div className={style.socialMedia}>
                        <span>Ми в соціальних мережах</span>

                    </div>

                </div>


            </div >

        </>
    )
}