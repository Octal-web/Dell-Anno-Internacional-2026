import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const CollectionBanner = ({ product }) => {
    const productBgRef = useRef(null);

    useEffect(() => {  
        gsap.registerPlugin(ScrollTrigger);     
        gsap.fromTo(productBgRef.current, 
        {
            backgroundPositionY: '100%',
        },
        {
            backgroundPositionY: '0%',
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: productBgRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }, []);
    
    return (
        <section
            ref={productBgRef}
            className="relative max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%]"
            style={{
                backgroundImage: `url(${product.banner})`,
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-0 bg-black opacity-50" />
            <div className="relative container max-w-large">
                <div className="pt-24 pb-10">
                    <h1 className="text-4xl md:text-5xl 2xl:text-[55px] text-white font-light text-center uppercase tracking-wide mb-6 md:mb-10">// {product.nome}</h1>
                    <p className="font-secondary text-white font-light text-center sm:tracking-wide whitespace-pre-line max-w-[1080px] mx-auto mb-10">{product.descricao}</p>
                </div>
            </div>
        </section>
    );
};