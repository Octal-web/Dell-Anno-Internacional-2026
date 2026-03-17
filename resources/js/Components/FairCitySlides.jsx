import React, { useState } from 'react';


import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";

import 'swiper/swiper-bundle.css';

import Lightbox from "yet-another-react-lightbox";
import { Fullscreen, Thumbnails, Zoom } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export const FairCitySlides = ({ slides, onSlideChange, setSwiperRef }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const lightboxSlides = slides.map(slide => ({
        src: slide.imagem
    }));

    const openLightbox = (index) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
    };

    return (
        <>
            <Swiper
                onSwiper={setSwiperRef}
                slidesPerView={1}
                onSlideChange={onSlideChange}
                effect="fade"
                loop={true}
                modules={[EffectFade]}
                fadeEffect={{ crossFade: true }}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="group aspect-[16/13] overflow-hidden cursor-pointer relative" onClick={() => openLightbox(index)}>
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
                        </div>
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
                index={currentIndex}
                className="[&_.yarl\_\_thumbnails\_thumbnail]:transition-all [&_.yarl\_\_thumbnails\_thumbnail:hover]:opacity-70 [&_.yarl\_\_thumbnails\_thumbnail\_active]:ring-2 [&_.yarl\_\_thumbnails\_thumbnail\_active]:ring-neutral-600"
            />
        </>
    );
};