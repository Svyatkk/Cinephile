'use client'
import styles from './style.module.css'
import { useState } from "react"
import { userService } from '@/api/user.service'



type Props = {
    id: string
}
//пзніше тут буде передавтися не id а дата фільму



export default function MoviePage({ id }: Props) {



    return (
        <>

            <div className={styles.block}>


                <div className={styles.poster}>

                </div>

                <div className={styles.side}>
                    <div className={styles.description}>
                        {id}
                    </div>

                    <div className={styles.seans}>

                    </div>
                </div>

            </div>

        </>
    )
}