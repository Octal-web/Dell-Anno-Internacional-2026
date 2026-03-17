import React, { useState } from 'react';

import Lightbox from "yet-another-react-lightbox";
import { Fullscreen, Thumbnails, Zoom } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { Reveal } from './Reveal';
import { StoreHorizontalLoop } from './StoreHorizontalLoop';

export const StoreProjects = ({ images }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    const half = Math.ceil(images.length / 2);
    const upperImages = images.slice(0, half);
    const lowerImages = images.slice(half);
    const lightboxSlides = images.map(image => ({
        src: image.imagem_zoom,
        alt: image.alt || "",
    }));

    const handleImageClick = (imageIndex, isUpperGallery = true) => {
        const globalIndex = isUpperGallery ? imageIndex : half + imageIndex;
        setCurrentImageIndex(globalIndex);
        setLightboxOpen(true);
    };

    return (
        <section className="pb-10 2xl:pb-30 2xl:mt-20">
            <div className="container max-w-large">
                <Reveal direction="bottom" scale={true}>
                    <h2 className="text-3xl text-center font-light uppercase sm:tracking-wide sm:leading-snug mb-6 md:mb-8 2xl:mb-10">
                        Project Gallery
                    </h2>
                    <p className="font-secondary text-center font-light max-md:text-justify md:leading-loose md:tracking-wide max-w-4xl mx-auto mb-10 md:mb-16 2xl:mb-24">
                        Explore a curated selection of our finest projects, where design meets purpose and elegance shapes every detail.
                    </p>
                </Reveal>
            </div>

            <div className="space-y-4 md:space-y-12">
                <StoreHorizontalLoop 
                    images={upperImages} 
                    direction="right" 
                    onImageClick={(index) => handleImageClick(index, true)}
                />
                <StoreHorizontalLoop 
                    images={lowerImages} 
                    direction="left" 
                    onImageClick={(index) => handleImageClick(index, false)}
                />
            </div>

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
                index={currentImageIndex}
                className="[&_.yarl\_\_thumbnails\_thumbnail]:transition-all [&_.yarl\_\_thumbnails\_thumbnail:hover]:opacity-70 [&_.yarl\_\_thumbnails\_thumbnail\_active]:ring-2 [&_.yarl\_\_thumbnails\_thumbnail\_active]:ring-neutral-600"
            />
        </section>
    );
};