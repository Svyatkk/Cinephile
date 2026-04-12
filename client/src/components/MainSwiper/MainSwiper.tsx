"use client";


import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from "swiper/modules";
import MovieBlock from "../MovieBlock/MovieBlock";
import "swiper/css"
import "swiper/css/navigation";

import styles from './style.module.css'



import { IMovie } from '@/types/movie.interface';

type Props = {
    movies: IMovie[] | null | undefined;
};

export default function MainSwiper({ movies }: Props) {


    return (
        <div className={styles.wrapper}>
            <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                spaceBetween={20}
                slidesPerView={4}
                loop={true}
                autoplay={{ delay: 3000 }}
                breakpoints={{
                    320: { slidesPerView: 1.2 },
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1400: { slidesPerView: 4 },
                }}
            >
                {movies?.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <MovieBlock movie={slide} ></MovieBlock>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}