import React, { useState } from 'react';

import 'swiper/swiper-bundle.css';
import Lightbox from "yet-another-react-lightbox";
import { Fullscreen, Thumbnails, Zoom } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

export const StoreProjectGallery = ({ slides }) => {
    const [currentSlide, setCurrentSlide] = useState(1);
    const [swiperRef, setSwiperRef] = useState(null);

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const lightboxSlides = slides.map((imagem) => ({
        src: imagem.imagem
    }));

    const totalSlides = slides.length;

    const handleSlideChange = (swiper) => {
        setCurrentSlide(swiper.realIndex + 1);
    };

    const formatNumber = (num) => {
        return num.toString().padStart(2, '0');
    };

    const goToPrevSlide = () => {
        if (swiperRef) {
            swiperRef.slidePrev();
        }
    };

    const goToNextSlide = () => {
        if (swiperRef) {
            swiperRef.slideNext();
        }
    };

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    return (
        <section className="py-10 md:py-14">
            <div className="container max-w-large">
                <div className="flex items-end justify-between mb-10">
                    <h2 className="text-3xl sm:text-4xl 2xl:text-[45px] font-light uppercase tracking-wide leading-snug -mb-2">Details</h2>

                    <div className="flex items-center">
                        <div className="flex items-center text-gray-400 text-sm font-light sm:tracking-widest">
                            <button 
                                onClick={goToPrevSlide}
                                className="mr-4 hover:text-gray-600 transition-colors disabled:opacity-50"
                                disabled={currentSlide === 1}
                            >
                                <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 2L3 9L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            
                            <span className="md:mx-3">
                                {formatNumber(currentSlide)} / {formatNumber(totalSlides)}
                            </span>
                            
                            <button 
                                onClick={goToNextSlide}
                                className="ml-4 hover:text-gray-600 transition-colors disabled:opacity-50"
                                disabled={currentSlide === totalSlides}
                                aria-label="Abrir galeria"
                            >
                                <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 16L9 9L2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <Swiper
                    onSwiper={setSwiperRef}
                    slidesPerView={1}
                    onSlideChange={handleSlideChange}
                    effect="fade"
                    modules={[EffectFade]}
                    fadeEffect={{ crossFade: true }}
                    className="max-sm:!-mx-[5vw]"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <button onClick={() => openLightbox(index)} className="relative group block w-full aspect-[37/23] md:aspect-[37/17]">
                                <img
                                    src={slide.imagem}
                                    className="w-full h-full object-cover"
                                    alt={`Slide ${index + 1}`}
                                />

                                <div className="absolute inset-0 bg-black opacity-0 transition-all duration-300 group-hover:opacity-50" />
                                    
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 z-10">
                                    <div className="bg-white bg-opacity-80 rounded-full p-3 shadow-lg">
                                        <svg 
                                            className="w-6 h-6 text-gray-700" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={1} 
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" 
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        </SwiperSlide>
                    ))}
                </Swiper>
                
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    plugins={[Fullscreen, Thumbnails, Zoom]}
                    thumbnails={{
                        position: "bottom",
                        width: 'auto',
                        height: 80,
                        border: 0,
                        borderRadius: 0,
                        padding: 4,
                        gap: 16,
                    }}
                    zoom={{
                        maxZoomPixelRatio: 3,
                        zoomInMultiplier: 2,
                        doubleTapDelay: 300,
                        doubleClickDelay: 300,
                        doubleClickMaxStops: 2,
                        keyboardMoveDistance: 50,
                        wheelZoomDistanceFactor: 100,
                        pinchZoomDistanceFactor: 100,
                    }}
                    slides={lightboxSlides}
                    index={lightboxIndex}
                    className="[&_.yarl\_\_thumbnails\_thumbnail]:transition-all [&_.yarl\_\_thumbnails\_thumbnail:hover]:opacity-70 [&_.yarl\_\_thumbnails\_thumbnail\_active]:ring-2 [&_.yarl\_\_thumbnails\_thumbnail\_active]:ring-neutral-600"
                />
            </div>
        </section>
    );
};