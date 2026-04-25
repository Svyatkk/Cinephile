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
import { ICinema, ICity } from '@/types/cinema.interface'
import { BASE_URL } from '@/api/config'
import PanelCities from '../PanelCities/PanelCities'



export default function NavBar() {

    const [active, setActive] = useState<boolean>(false)
    const route = useRouter()
    const [user, setUser] = useState<IUser | null>(null)
    const [cities, setCities] = useState<ICity[]>([])
    const [activePanelCities, setActivePanelCities] = useState<boolean>(false)

    const [chosenCity, setchosenCity] = useState<ICity | null>(null)
    const [chosenCiname, setchosenCiname] = useState<ICinema | null>(null)


    useEffect(() => {
        const fetchCities = async () => {
            const response = await fetch(`${BASE_URL}/city`);
            const data = await response.json();
            setCities(data);
        };
        fetchCities();
    }, [])



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
                        <p className={active ? styles.activeLogo : ''} onClick={() => route.push(PAGES_URL.MAIN)}>Cinephile</p>
                    </div>

                </div>

                <div className={styles.block}>

                    <div className={styles.citySection}>
                        <div className={styles.choseCity}>
                            {chosenCity && (
                                <div>
                                    {chosenCity.name}
                                    {chosenCiname && ` | ${chosenCiname.name}`}
                                </div>
                            )}
                        </div>
                        <button onClick={() => {

                            setActivePanelCities(prev => !prev)


                        }} className={styles.buttonCities} >

                        </button>

                    </div>


                    <div>

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
                </div>

                <SideBar active={active}></SideBar>
                <div
                    className={`${styles.blockTrans} ${active ? styles.active : ''}`}
                    onClick={() => setActive(false)}
                >
                </div>
                <PanelCities setChosenCinema={setchosenCiname} setChosenCity={setchosenCity} active={activePanelCities} cities={cities}></PanelCities>



            </nav >
        </>
    )
}