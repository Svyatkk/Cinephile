'use client'
import { useEffect, useState } from "react"
import { IUser } from "@/types/user.interface"
import styels from './style.module.css'

export default function Accout() {


    const [user, setUser] = useState<IUser | null>(null)


    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [])

    return (
        <>

            <div className={styels.block}>
                {user?.email}
                {user?.password}
            </div>



        </>
    )
}