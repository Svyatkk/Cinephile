'use client'
import styles from './styles.module.css'
import Link from 'next/link'

type Props = {
    arr?: {
        name: string,
        link: string
    }[]
}

export default function BreadCrumbs({ ...arr }: Props) {
    return (
        <section className={styles.breadCrumbs}>
            {
                arr.arr?.map((link, index) => {
                    return <div className={styles.link} key={index}>
                        <Link href={`${link.link}`}>{link.name}</Link>
                    </div>
                })
            }
        </section>
    )
}