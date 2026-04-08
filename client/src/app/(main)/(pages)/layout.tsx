
import NavBar from "@/components/Navbar/Navbar"
import styles from './pages.module.css'



type Props = {
    children: React.ReactNode
}

export default function Pages({ children }: Props) {

    return (
        <>
            <div className={styles.rootPages}>
                <div className={styles.pages}>
                    {children}

                </div>
            </div>


        </>
    )
}