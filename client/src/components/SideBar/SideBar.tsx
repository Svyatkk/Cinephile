'use client'

import { useState } from 'react'
import style from './style.module.css'

type Props = {
    active: boolean
}


export default function SideBar({ active }: Props) {




    return (
        <>


            <div className={`${style.sideBar} ${active ? style.open : ''}`}>

            </div>

        </>
    )
}