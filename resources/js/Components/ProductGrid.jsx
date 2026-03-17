import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Captions, Fullscreen, Thumbnails, Zoom } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { Reveal } from "./Reveal";

export const ProductGrid = ({ product }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const lightboxSlides = product.imagens.map((imagem) => ({
        src: imagem.imagem,
        alt: imagem.texto,
        description: imagem.texto,
    }));

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    return (
        <>
            <section className="pt-8 md:pt-12 2xl:pt-20">
                <div className="container max-w-x-large">
                    <h1 className="text-4xl md:text-5xl 2xl:text-[55px] text-center font-light uppercase tracking-wide leading-snug mb-6">// {product.nome}</h1>
                    <p className="font-secondary text-center whitespace-pre-line">{product.descricao}</p>
                </div>
            </section>

            <section className="pt-8 md:pt-16 mb-16 md:mb-20 2xl:mb-24">
                <div className="container max-w-medium">
                    <div className="grid grid-cols-3 auto-rows-[28vw] md:auto-rows-[24vw] min-[1440px]:auto-rows-[410px] grid-flow-dense gap-3 md:gap-5 
                        [&_>_div:nth-child(6n+1)]:col-span-2 [&_>_div:nth-child(6n+2)]:col-span-2
                        [&_>_div:nth-child(6n+5)]:col-span-2 [&_>_div:nth-child(6n+6)]:col-span-2
                        [&_>_div:nth-child(6n+3)]:row-span-2 [&_>_div:nth-child(6n+4)]:row-span-2
                    ">
                        {product.imagens.map((imagem, index) => (
                            <Reveal scale={true} key={index} delay={index * 0.8} className="relative overflow-hidden">
                                <img src={imagem.imagem} alt={imagem.titulo} className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => openLightbox(index)}
                                    className="group text-left absolute inset-0"
                                >
                                    <div className="hidden md:block absolute inset-0 bg-black opacity-0 transition-all duration-300 group-hover:opacity-50" />
                                    <div className="hidden md:block absolute left-6 bottom-6 right-6 translate-y-20 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                        <p className="font-secondary text-white font-light">{imagem.texto}</p>
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
                plugins={[Captions, Fullscreen, Thumbnails, Zoom]}
                captions={{
                    showToggle: true,
                    descriptionTextAlign: "center",
                }}
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
                        <Link
                            href={route('Produtos.colecoes', {slug: product.slug})}
                            key="more-button"
                            className="flex items-center yarl__button -order-1"
                            title={`More About ${product.nome}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-[hsla(0,0%,100%,.8)] hover:fill-white">
                                <g>
                                    <polygon points="13,11 13,3.1 11,3.1 11,11 3.1,11 3.1,13 11,13 11,20.9 13,20.9 13,13 20.9,13 20.9,11"/>
                                </g>
                            </svg>
                        </Link>,
                        "close"
                    ],
                }}
                className="[&_.yarl\_\_slide\_description]:font-secondary [&_.yarl\_\_slide\_description]:font-light [&_.yarl\_\_slide\_description]:pb-3 [&_.yarl\_\_thumbnails\_thumbnail]:transition-all [&_.yarl\_\_thumbnails\_thumbnail:hover]:opacity-70 [&_.yarl\_\_thumbnails\_thumbnail\_active]:!ring-2 [&_.yarl\_\_thumbnails\_thumbnail\_active]:ring-neutral-600"
            />

            <Link href={route('Produtos.colecoes', {slug: product.slug})} className="block w-fit mx-auto mt-10 mb-36 border border-neutral-800 bg-white font-light text-center uppercase p-2 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white">Discover More</Link>
        </>
    );
};