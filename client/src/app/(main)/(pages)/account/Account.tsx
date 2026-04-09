'use client'
import { useEffect, useState } from "react"
import { IUser } from "@/types/user.interface"
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
            {user?.email}
            {user?.password}

        </>
    )
}