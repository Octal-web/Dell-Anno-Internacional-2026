import { useEffect, useRef, useState } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Link } from '@inertiajs/react';

export const HomePostsSlides = ({ slides }) => {
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
    
    return (
        <div ref={containerRef}>
            <Swiper
                slidesPerView={3.1}
                spaceBetween={30}
                breakpoints={{
                    0: { slidesPerView: 1.3, spaceBetween: 20 },
                    500: { slidesPerView: 1.8, spaceBetween: 20 },
                    1280: { slidesPerView: 3.1, spaceBetween: 30 },
                }}
                className="!overflow-visible"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index} className="!h-auto">
                        <div className="h-full" ref={el => slidesRef.current[index] = el}>
                            <div className="group flex flex-col items-start h-full">
                                <Link href={route('Blog.post', {slug: slide.slug})} target="_blank" className="overflow-hidden aspect-[13/9] w-full block" aria-label={slide.titulo}>
                                    <img src={slide.imagem} className="transition-all duration-500 group-hover:scale-110" alt={slide.titulo} />
                                </Link>
                                <Link href={route('Blog.post', {slug: slide.slug})} target="_blank" className="block my-4 md:my-6 mr-4" aria-label={slide.titulo}>
                                    <h3 className="text-2xl 2xl:text-3xl font-light h-[2.4em] uppercase line-clamp-2">{slide.titulo}</h3>
                                </Link>
                                <div className="font-secondary text-sm sm:text-base font-light sm:tracking-wide max-w-md mb-8 2xl:mb-10 line-clamp-3">{slide.previa}</div>
                                <Link href={route('Blog.post', {slug: slide.slug})} target="_blank" className="mt-auto border border-neutral-800 bg-white font-light text-center uppercase p-2 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white" aria-label={slide.titulo}>Read More</Link>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};