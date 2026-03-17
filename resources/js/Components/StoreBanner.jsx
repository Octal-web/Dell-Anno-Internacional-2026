import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const StoreBanner = ({ store }) => {
    const storeBgRef = useRef(null);

    useEffect(() => {  
        gsap.registerPlugin(ScrollTrigger);     
        gsap.fromTo(storeBgRef.current, 
        {
            backgroundPositionY: '100%',
        },
        {
            backgroundPositionY: '0%',
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: storeBgRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }, []);
    
    return (
        <section className="pt-16 sm:pt-20 md:pt-24 2xl:pt-32 pb-10 2xl:pb-20">
            <div className="container max-w-large">
                <img src={store.logo} className="mx-auto mb-8 md:mb-10 2xl:mb-14" />
                <p className="font-secondary font-light text-justify md:text-center sm:tracking-wide sm:leading-loose whitespace-pre-line max-w-[880px] mx-auto mb-24 2xl:mb-30">{store.chamada}</p>
            </div>
            
            <div
                ref={storeBgRef}
                className="relative aspect-[3/2] md:aspect-[192/71] max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%]"
                style={{
                    backgroundImage: `url(${store.imagem})`,
                }}
            />
        </section>
    );
};