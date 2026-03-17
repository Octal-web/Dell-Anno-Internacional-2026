import { Link } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

export const FairYearYears = ({ slides, currentYear }) => {
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);
    const swiperRef = useRef(null);

    const slidesPerView = slides.length < 12 ? slides.length : 12;
    
    return (
        <section className="pt-16">
            <div className="container max-w-large">
                <p className="mb-6 md:mb-8 font-secondary font-bold text-center sm:leading-loose">select the fair year:</p>
                <div className="relative border-b border-neutral-300 pb-4 px-10">
                    <div className="max-w-[1350px] mx-auto">
                        <Swiper
                            slidesPerView={slidesPerView}
                            modules={[]}
                            loop={false}
                            onBeforeInit={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                        >
                            {slides.map((slide, index) => 
                                <SwiperSlide key={index}>
                                    <Link
                                        href={route('Mostras.mostra.ano', {slug: slide.slug, ano: slide.ano})}
                                        className="text-center w-24 mx-auto transition-all cursor-pointer hover:opacity-70"
                                    >
                                        <h5 className={`text-lg ${slide.ano === currentYear ? 'font-bold' : 'font-light'} uppercase leading-snug p-3 md:p-4`}>{slide.ano}</h5>
                                    </Link>
                                </SwiperSlide>
                            )}
                        </Swiper>
                    </div>
                    
                    <button
                        ref={prevButtonRef}
                        className="[&:not(.swiper-button-lock)]:group w-16 h-16 absolute -top-1 -left-3 flex items-center justify-center [&.swiper-button-lock]:!flex [&.swiper-button-lock]:!opacity-50"
                    >
                        <ArrowIcon className="rotate-180 fill-none stroke-black opacity-30 transition-all group-hover:opacity-100" />
                    </button>

                    <button
                        ref={nextButtonRef}
                        className="[&:not(.swiper-button-lock)]:group w-16 h-16 absolute -top-1 -right-3 flex items-center justify-center [&.swiper-button-lock]:!flex [&.swiper-button-lock]:!opacity-50"
                    >
                        <ArrowIcon className="fill-none stroke-black opacity-30 transition-all group-hover:opacity-100" />
                    </button>
                </div>
            </div>
        </section>
    );
};

const ArrowIcon = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11.013"
            height="18"
            viewBox="0 0 11.013 18"
            className={className}
        >
            <path d="M0,0,9.4,8.05,0,16.107" transform="translate(0.946 0.946)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.342"/>
        </svg>
    )
};