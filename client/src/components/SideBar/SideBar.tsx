'use client'

import { useState } from 'react'
import style from './style.module.css'
import { useRouter } from 'next/navigation'
import { PAGES_URL } from '@/api/config'
type Props = {
    active: boolean
}


export default function SideBar({ active }: Props) {

    const route = useRouter()


    const handleLogout = () => {
        localStorage.removeItem('user');

        window.location.href = PAGES_URL.MAIN;
    }


    return (
        <>


            <div className={`${style.sideBar} ${active ? style.open : ''}`}>
                <button onClick={handleLogout}>Вийти</button>
            </div>

        </>
    )
}