import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LetterReveal from './LetterReveal';

export const ShowroomBanner = ({ showroom }) => {
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
        <>
            <section
                ref={showroomBgRef}
                className="relative max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%]"
                style={{
                    backgroundImage: `url(${showroom.banner})`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="relative container max-w-x-large">
                    <div className="h-[354px] flex items-end">
                        <h3 className="text-3xl 2xl:text-[37px] text-white font-bold mb-12">
                            {showroom.nome}
                            {showroom.cidade ? (
                                <span className="font-light">{` – ${showroom.cidade}`}</span>
                            ) : ''}
                        </h3>
                    </div>
                </div>
            </section>

            <section>
                <div className="container max-w-x-large">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center py-16 md:py-24 2xl:py-30">
                        <LetterReveal className="text-3xl md:text-4xl 2xl:text-[45px] font-light uppercase sm:leading-tight tracking-wide max-w-xl" text={showroom.chamada} element="h1" />
                        <p className="font-secondary font-light max-md:text-justify sm:tracking-wide sm:leading-loose whitespace-pre-line max-w-[620px] md:pl-12 max-md:pt-10">{showroom.texto_chamada}</p>
                    </div>
                </div>
            </section>
        </>
    );
};