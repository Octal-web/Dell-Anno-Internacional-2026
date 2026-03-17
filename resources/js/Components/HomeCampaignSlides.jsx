import { useEffect, useRef, useState } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

export const HomeCampaignSlides = ({ slides }) => {
    const containerRef = useRef(null);
    const slidesRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            slidesRef.current.forEach((slide, index) => {
                if (!slide) return;

                gsap.fromTo(slide, 
                    {
                        y: 100,
                        opacity: 0,
                        scale: 0.8,
                        rotationY: 15,
                    },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        rotationY: 0,
                        duration: 1.2,
                        ease: "power3.out",
                        delay: index * 0.15,
                        scrollTrigger: {
                            trigger: slide,
                            start: "top 85%",
                            end: "bottom 20%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, [slides]);

    const [currentSlide, setCurrentSlide] = useState(1);
    const totalSlides = slides.length;
    const swiperRef = useRef(null);

    const handleSlideChange = (swiper) => {
        setCurrentSlide(swiper.realIndex + 1);
    };

    const formatNumber = (num) => {
        return num.toString().padStart(2, '0');
    };

    const goToPrevSlide = () => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    const goToNextSlide = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    return (
        <div ref={containerRef}>
            <div className="flex items-center mb-8">
                <div className="flex items-center text-gray-400 text-sm font-light sm:tracking-widest">
                    <button 
                        onClick={goToPrevSlide}
                        className="mr-4 hover:text-gray-600 transition-colors disabled:opacity-50"
                        disabled={currentSlide === 1}
                        aria-label="Ver campanha"
                    >
                        <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 2L3 9L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    
                    <span className="mx-3">
                        {formatNumber(currentSlide)} / {formatNumber(totalSlides)}
                    </span>
                    
                    <button 
                        onClick={goToNextSlide}
                        className="ml-4 hover:text-gray-600 transition-colors disabled:opacity-50"
                        disabled={currentSlide === totalSlides}
                        aria-label="Go to next slide"
                    >
                        <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 16L9 9L2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>

            <Swiper
                ref={swiperRef}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                slidesPerView={2.1}
                spaceBetween={30}
                onSlideChange={handleSlideChange}
                breakpoints={{
                    0: { slidesPerView: 1.3, spaceBetween: 20 },
                    500: { slidesPerView: 1.8, spaceBetween: 20 },
                    1280: { slidesPerView: 2.2, spaceBetween: 30 },
                }}
                className="!overflow-visible"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index} className="!h-auto">
                        <div className="h-full" ref={el => slidesRef.current[index] = el}>
                            <div className="group flex flex-col items-start h-full">
                                <a href={slide.link} target="_blank" className="overflow-hidden" aria-label={slide.titulo}>
                                    <img src={slide.imagem} className="transition-all duration-500 group-hover:scale-110" alt={slide.titulo} />
                                </a>
                                <a href={slide.link} target="_blank" className="block my-4 2xl:my-6" aria-label={slide.titulo}>
                                    <h3 className="text-2xl 2xl:text-3xl font-light uppercase">{slide.titulo}</h3>
                                </a>
                                <div className="font-secondary text-sm sm:text-base font-light max-md:text-justify sm:tracking-wide max-w-md mb-8 2xl:mb-10" dangerouslySetInnerHTML={{ __html: slide.descricao }} />
                                <a href={slide.link} target="_blank" className="mt-auto border border-neutral-800 bg-white font-light text-center uppercase p-2 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white" aria-label={slide.titulo}>Discover Now</a>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};