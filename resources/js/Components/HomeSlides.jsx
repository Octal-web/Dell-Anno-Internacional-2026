import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

export const HomeSlides = ({ slides }) => {
    const swiperRef = useRef(null);
    const paginationRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [swiperInstance, setSwiperInstance] = useState(null);

    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.realIndex);
    };

    const onSwiper = (swiper) => {
        setSwiperInstance(swiper);
        setActiveIndex(swiper.realIndex);
    };

    useEffect(() => {
        if (swiperInstance && paginationRef.current) {
            swiperInstance.params.pagination.el = paginationRef.current;
            
            swiperInstance.pagination.init();
            swiperInstance.pagination.update();
        }
    }, [swiperInstance, paginationRef.current]);

    useEffect(() => {
        return () => {
            if (swiperInstance) {
                swiperInstance.destroy(true, true);
            }
        };
    }, []);

    const getBackgroundGradient = () => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768
                ? "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)"
                : "linear-gradient(2deg, rgb(0 0 0 / 67%) 0%, rgba(84, 84, 84, 0) 102%)";
        }
        return "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)";
    };

    return (
        <div className="relative">
            <Swiper
                slidesPerView={1}
                allowTouchMove={false}
                effect="fade"
                pagination={{
                    el: paginationRef.current,
                    clickable: true,
                    renderBullet: function (index, className) {
                        return `<span class="${className}"></span>`;
                    },
                }}
                autoplay={{ delay: 10000 }}
                loop
                onSwiper={onSwiper}
                onSlideChange={handleSlideChange}
                modules={[Pagination, Autoplay, EffectFade]}
                className="[&_+_div_.swiper-pagination-bullet]:!border-white [&_+_div_.swiper-pagination-bullet]:border-2 [&_+_div_.swiper-pagination-bullet]:w-3 [&_+_div_.swiper-pagination-bullet]:h-3 [&_+_div_.swiper-pagination-bullet]:opacity-100 [&_+_div_.swiper-pagination-bullet.swiper-pagination-bullet-active]:bg-white"
                ref={swiperRef}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative z-[1] h-[calc(100vh_-_145px)] flex items-center">
                            {slide.tipo === 'imagem' && (
                                <div className="absolute inset-0 bg-cover bg-center">
                                    <picture>
                                        <source
                                            media="(max-width: 767px)"
                                            srcSet={slide.imagem_mobile}
                                        />
                                        <img
                                            className="w-full h-full object-cover"
                                            alt="Slide"
                                            src={slide.imagem}
                                        />
                                    </picture>
                                </div>
                            )}
                            {slide.tipo === 'video' && (
                                <>
                                    <video
                                        className="absolute inset-0 w-full h-full object-cover hidden md:block"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    >
                                        <source src={slide.video} type="video/mp4" />
                                    </video>

                                    <video
                                        className="absolute inset-0 w-full h-full object-cover block md:hidden"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    >
                                        <source src={slide.video_mobile} type="video/mp4" />
                                    </video>
                                </>
                            )}

                            <div
                                className="absolute inset-0"
                                style={{
                                    background: getBackgroundGradient()
                                }}
                            />

                            <div className="container max-w-x-large h-full">
                                <div
                                    className={`flex flex-col relative w-full h-full md:w-[70%] xl:w-1/2 max-w-[474px] justify-end pb-20 2xl:pb-30 transition-opacity duration-1000 ease-in-out z-[1] ${
                                        activeIndex === index
                                            ? 'animate-fade-in-down'
                                            : 'opacity-0'
                                    }`}
                                >
                                    {slide.link && (
                                        <a href={slide.link} className="text-white font-light uppercase border border-white w-fit px-8 py-2 transition-all hover:opacity-70" target="_blank" rel="noopener noreferrer">{slide.texto_botao}</a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="relative container max-w-large">
                <div className="absolute bottom-16 md:bottom-40 2xl:bottom-50 max-md:w-full left-0 z-10 opacity-80 max-md:ml-0 max-2xl:ml-12">
                    <div className="container max-w-large">
                        <div className="flex items-center justify-center">
                            <div
                                ref={paginationRef}
                                className="flex items-center space-x-4"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};