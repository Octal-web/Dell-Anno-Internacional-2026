import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LetterReveal from './LetterReveal';

export const StoreShowroomImage = ({ image }) => {
    const showroomBgRef = useRef(null);

    useEffect(() => {  
        gsap.registerPlugin(ScrollTrigger);     
        gsap.fromTo(showroomBgRef.current, 
        {
            backgroundPositionY: '100%',
        },
        {
            backgroundPositionY: '0%',
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: showroomBgRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }, []);
    
    return (
        <section className="pb-20">
            <LetterReveal className="text-3xl text-center font-light uppercase sm:tracking-wide sm:leading-snug mb-6 md:mb-8 2xl:mb-10" text="Showroom" element="h2" />

            <div
                ref={showroomBgRef}
                className="relative aspect-[48/25] max-h-[85vh] w-full max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%]"
                style={{
                    backgroundImage: `url(${image})`,
                }}
            />
        </section>
    );
};