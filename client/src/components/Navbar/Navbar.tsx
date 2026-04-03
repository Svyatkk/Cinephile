'use client'
import styles from './style.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import SideBar from '../SideBar/SideBar'
export default function NavBar() {

    const [active, setActive] = useState<boolean>(false)
    const [ham, setHam] = useState<boolean>(false)




    return (
        <>

            <nav className={styles.nav}>



                <div className={styles.firstBlock}>
                    <div
                        onClick={() => {

                            setActive(prev => !prev)



                        }}
                        className={styles.hamMenu}
                    >
                        <span></span>
                        <span></span>
                        <span></span>


                    </div>

                    <div className={styles.logo}>
                        <p>Cinephile</p>
                    </div>

                </div>


                <div className={styles.block}>

                    <Link href={'login'} className={styles.login}>
                        <p>Увійти</p>
                        <Image
                            src="/profileImg.svg"
                            alt="Іконка профілю"
                            width={30}
                            height={30}
                            className={styles.icon}
                        />
                    </Link>

                </div>



                <SideBar active={active}></SideBar>

                <div className={`${styles.blockTrans} ${active ? styles.active : ''}`}>


                </div>

            </nav >
        </>
    )
}