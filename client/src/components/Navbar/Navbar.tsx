'use client'
import styles from './style.module.css'
import Link from 'next/link'
import Image from 'next/image'
export default function NavBar() {


    

    return (
        <>

            <nav className={styles.nav}>
                <div className={styles.logo}>
                    <p>Cinephile</p>
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
            </nav>
        </>
    )
}