'use client'

import { useEffect, useState } from 'react'
import style from './style.module.css'
import { useRouter } from 'next/navigation'
import { PAGES_URL } from '@/api/config'
import Link from 'next/link'
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


    const handleLogout = (e: MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = PAGES_URL.MAIN;
        setUser(false)
    }

    return (
        <div className={`${style.sideBar} ${active ? style.open : ''}`}>
            <div className={style.blocks}>

                <div className={style.links}>
                    <Link className={`${style.link} ${style.redText}`} href={PAGES_URL.MAIN}>Зараз у кіно</Link>
                    <Link className={style.link} href={PAGES_URL.MAIN}>Скоро у прокаті</Link>
                    <Link className={`${style.link} ${style.yellowText}`} href={PAGES_URL.MAIN}>Купити попкорн онлайн</Link>
                    <Link className={style.link} href={PAGES_URL.MAIN}>Акції та знижки</Link>
                    <Link className={style.link} href={PAGES_URL.MAIN}>Кінотеатри</Link>
                    <Link className={style.link} href={PAGES_URL.MAIN}>Повернення квитків</Link>
                    <Link className={style.link} href={PAGES_URL.MAIN}>Допомога</Link>
                    <Link className={style.link} href={PAGES_URL.MAIN}>Про компанію</Link>
                </div>

                <div className={style.logout}>
                    <span className={style.sectionTitle}>ОСОБИСТИЙ КАБІНЕТ</span>
                    {user ? (
                        <button onClick={handleLogout} className={style.loginBtn}>
                            <Image
                                src="/profileImg.svg"
                                alt="Іконка профілю"
                                width={20}
                                height={20}
                                className={style.icon}
                            />
                            Вийти
                        </button>
                    ) : (
                        <Link href={PAGES_URL.AUTH} className={style.loginBtn}>
                            <Image
                                src="/profileImg.svg"
                                alt="Іконка профілю"
                                width={20}
                                height={20}
                                className={style.icon}
                            />
                            Увійти
                        </Link>
                    )}
                </div>

                <div className={style.socialMedia}>
                    <span className={style.sectionTitle}>МИ В СОЦІАЛЬНИХ МЕРЕЖАХ</span>
                    <div className={style.socialLinks}>
                        <a href="#"><div className={style.socialIcon}>f</div> Facebook</a>
                        <a href="#"><div className={style.socialIcon}>y</div> Youtube</a>
                        <a href="#"><div className={style.socialIcon}>i</div> Instagram</a>
                        <a href="#"><div className={style.socialIcon}>t</div> Telegram</a>
                    </div>
                </div>

            </div>
        </div>
    )
}