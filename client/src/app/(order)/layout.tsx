import React from "react"
import styles from './styles.module.css'
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs"
import { PAGES_URL } from "@/api/config"
type Props = {
    children: React.ReactNode
}
const breadcrumbsList = [
    {
        name: 'Місця',
        link: `${PAGES_URL.SEATPLAN}`,
    },
    {
        name: 'Оплата',
        link: `${PAGES_URL.CHECKOUT}`,
    },
    {
        name: 'Замовлення',
        link: '/order-success',
    }
]

export default function LayoutOrder({ children }: Props) {
    return (
        <div className={styles.pageLayout}>
            <BreadCrumbs arr={breadcrumbsList}></BreadCrumbs>
            {children}

        </div>
    )
}