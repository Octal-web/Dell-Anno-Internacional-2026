import { useRef, useEffect, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

import { AboutTimelineSlides } from './AboutTimelineSlides';

export const AboutTimeline = ({ slides }) => {
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [slidesSwiperRef, setSlidesSwiperRef] = useState(null);

    const slidesPerView = slides.length < 12 ? slides.length : 12;

    const handleSlideChange = (swiper) => {
        const newIndex = swiper.activeIndex;
        setActiveIndex(newIndex);
    };

    const handleChildSlideChange = (newIndex) => {
        setActiveIndex(newIndex);
        if (swiperRef.current) {
            swiperRef.current.slideTo(newIndex);
        }
    };

    const handleChildSwiperInit = (childSwiper) => {
        setSlidesSwiperRef(childSwiper);
        
        if (prevButtonRef.current && nextButtonRef.current) {
            childSwiper.params.navigation.prevEl = prevButtonRef.current;
            childSwiper.params.navigation.nextEl = nextButtonRef.current;
            childSwiper.navigation.init();
            childSwiper.navigation.update();
        }
    };
    
    const handleSlideClick = (index) => {
        setActiveIndex(index);
        if (swiperRef.current) {
            swiperRef.current.slideToLoop ? 
                swiperRef.current.slideToLoop(index) : 
                swiperRef.current.slideTo(index);
        }
        
        if (slidesSwiperRef) {
            slidesSwiperRef.slideToLoop ? 
                slidesSwiperRef.slideToLoop(index) : 
                slidesSwiperRef.slideTo(index);
        }
    };

    return (
        <section className="pt-6 md:pt-12 2xl:pt-20">
            <div className="container max-w-large">
                <h2 className="text-3xl md:text-4xl 2xl:text-[45px] text-center font-light uppercase tracking-wide leading-snug mb-8 md:mb-10 md:mb-16 2xl:mb-20">Timeline</h2>

                <div className="relative border-b border-neutral-300 pb-4 px-10">
                    <div className="max-w-[1350px] mx-auto">
                        <Swiper
                            slidesPerView={slidesPerView}
                            modules={[]}
                            loop={false}
                            onBeforeInit={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            onSlideChange={handleSlideChange}
                            initialSlide={0}
                        >
                            {slides.map((slide, index) => 
                                <SwiperSlide key={index}>
                                    <div
                                        className="text-center w-24 mx-auto transition-all cursor-pointer hover:opacity-70"
                                        onClick={() => handleSlideClick(index)}
                                    >
                                        <h5 className={`text-lg ${activeIndex === index ? 'font-bold' : 'font-light'} uppercase leading-snug p-4`}>{slide.ano}</h5>
                                    </div>
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

                <AboutTimelineSlides 
                    slides={slides} 
                    activeIndex={activeIndex} 
                    onSwiperInit={handleChildSwiperInit}
                    onSlideChange={handleChildSlideChange}
                    prevButtonRef={prevButtonRef}
                    nextButtonRef={nextButtonRef}
                />
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