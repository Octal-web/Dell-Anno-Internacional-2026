import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Fullscreen, Thumbnails, Zoom } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { Reveal } from "./Reveal";

export const ShowroomGrid = ({ showroom }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const lightboxSlides = showroom.imagens.map((imagem) => ({
        src: imagem.imagem,
    }));

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    return (
        <>
            <section className="pt-8 md:pt-16 mb-16 md:mb-20 2xl:mb-24">
                <div className="container max-w-x-large">
                    <div className="grid grid-cols-2 md:grid-cols-3 grid-flow-dense gap-3 md:gap-5 [&_>_div:nth-child(4n+1)]:col-span-2 md:[&_>_div:nth-child(4n+1)]:col-span-1 md:[&_>_div:nth-child(8n+1)]:col-span-2 md:[&_>_div:nth-child(8n+5)]:col-span-2 [&_>_div:nth-child(4n+3)]:col-span-2 md:[&_>_div:nth-child(4n+3)]:col-span-1 md:[&_>_div:nth-child(8n+3)]:col-span-3">
                        {showroom.imagens.map((imagem, index) => (
                            <Reveal scale={true} key={index} delay={index * 0.8} className="relative overflow-hidden h-[34vw] sm:h-[25vw] 2xl:h-[29vw] max-h-[548px]">
                                <img src={imagem.imagem} alt={imagem.titulo} className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => openLightbox(index)}
                                    className="group text-left absolute inset-0"
                                >
                                    <div className="hidden md:block absolute inset-0 bg-black opacity-0 transition-all duration-300 group-hover:opacity-50" />
                                    
                                    <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 z-10">
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
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={lightboxSlides}
                index={lightboxIndex}
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
                    toolbar={{
                    buttons: [
                        "close"
                    ],
                }}
                className="[&_.yarl\_\_slide\_description]:font-secondary [&_.yarl\_\_slide\_description]:font-light [&_.yarl\_\_slide\_description]:pb-3 [&_.yarl\_\_thumbnails\_thumbnail]:transition-all [&_.yarl\_\_thumbnails\_thumbnail:hover]:opacity-70 [&_.yarl\_\_thumbnails\_thumbnail\_active]:ring-2 [&_.yarl\_\_thumbnails\_thumbnail\_active]:ring-neutral-600"
            />
        </>
    );
};