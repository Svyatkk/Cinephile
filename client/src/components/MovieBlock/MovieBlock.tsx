import styles from './style.module.css'
import { IMovive } from '@/types/movie.interface'
import { useRouter } from 'next/navigation'
type Props = {
    movie: IMovive
}

export default function MovieBlock({ movie }: Props) {

    const route = useRouter()



    return (
        <>



            <div onClick={() => {
                route.push(`/movie/${movie.id}`)
            }} className={styles.block}>

                {movie.title}

            </div>


        </>
    )
}