import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import LetterReveal from './LetterReveal';

gsap.registerPlugin(ScrollTrigger);    

export const InspirationBanner = ({ content }) => {
    const inspirationBgRef = useRef(null);

    useEffect(() => { 
        gsap.fromTo(inspirationBgRef.current, 
        {
            backgroundPositionY: '100%',
        },
        {
            backgroundPositionY: '0%',
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: inspirationBgRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }, []);
    
    return (
        <section className="pb-10">
            <div className="container max-w-x-large">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center py-16 md:py-24 2xl:py-30">
                    <LetterReveal className="text-4xl md:text-5xl 2xl:text-[55px] font-light uppercase sm:tracking-wide" text={content.titulo} element="h1" />
                    <p className="font-secondary font-light sm:tracking-wide sm:leading-loose whitespace-pre-line max-w-[620px] md:pl-12 max-md:pt-10">{content.texto}</p>
                </div>
            </div>

            <div
                ref={inspirationBgRef}
                className="h-[350px] sm:h-[400px] md:h-[500px] 2xl:h-[570px] max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%]"
                style={{
                    backgroundImage: `url(${content.imagem})`,
                }}
            />
        </section>
    );
};