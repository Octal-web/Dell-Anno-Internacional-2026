import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import LetterReveal from './LetterReveal';

gsap.registerPlugin(ScrollTrigger);    

export const AboutPainting = ({ content }) => {
    const paintingbgRef = useRef(null);

    useEffect(() => { 
        gsap.fromTo(paintingbgRef.current, 
        {
            backgroundPositionY: '100%',
        },
        {
            backgroundPositionY: '0%',
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: paintingbgRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }, []);
    
    return (
        <section className="py-10 2xl:py-30 md:mt-10" id="sustainability">
            <div className="container max-w-medium">
                <LetterReveal className="text-2xl sm:text-3xl md:text-4xl 2xl:text-[45px] text-center font-light uppercase leading-snug mb-16 2xl:mb-24" text={content.titulo} element="h2" />
            </div>

            <div
                ref={paintingbgRef}
                className="h-[300px] md:h-[400px] max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%]"
                style={{
                    backgroundImage: `url(${content.imagem})`,
                }}
            />
        </section>
    );
};