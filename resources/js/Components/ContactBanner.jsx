import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const ContactBanner = ({ content }) => {
    const contactBgRef = useRef(null);

    useEffect(() => {  
        gsap.registerPlugin(ScrollTrigger);     
        gsap.fromTo(contactBgRef.current, 
        {
            backgroundPositionY: '100%',
        },
        {
            backgroundPositionY: '0%',
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: contactBgRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }, []);
    
    return (
        <section
            ref={contactBgRef}
            className="relative h-[280px] max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%]"
            style={{
                backgroundImage: `url(${content.imagem})`,
            }}
        >
            <div className="absolute inset-0 bg-black/70" />
            <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-4xl md:text-5xl 2xl:text-[55px] text-white font-light uppercase sm:tracking-wide sm:leading-snug whitespace-nowrap">{content.titulo}</h1>
            </div>
        </section>
    );
};