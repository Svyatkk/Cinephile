import styles from './style.module.css'
import { IMovive } from '@/types/movie.interface'

type Props = {
    movie: IMovive
}

export default function MovieBlock({ movie }: Props) {
    return (
        <>

            <div className={styles.block}>

                {movie.id}
                {movie.title}

            </div>


        </>
    )
}