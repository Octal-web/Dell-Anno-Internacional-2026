import React, { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const FinishesBanner = ({ current, content, finishes }) => {
    const finishesBgRef = useRef(null);

    useEffect(() => {  
        gsap.registerPlugin(ScrollTrigger);     
        gsap.fromTo(finishesBgRef.current, 
        {
            backgroundPositionY: '100%',
        },
        {
            backgroundPositionY: '0%',
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: finishesBgRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }, []);

    return (
        <>
            <section
                ref={finishesBgRef}
                className="relative h-[380px] md:h-[450px] 2xl:h-[504px] max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%]"
                style={{
                    backgroundImage: `url(${content.imagem})`,
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <h1 className="text-4xl md:text-5xl 2xl:text-[55px] text-white font-light uppercase sm:tracking-wide sm:leading-snug whitespace-nowrap mb-4 mt-[9%]">{content.titulo}</h1>

                    <p className="max-w-xl font-secondary text-white text-center font-light px-5">{content.texto}</p>
                </div>
            </section>

            <div className="py-10 bg-neutral-100">
                <div className="container max-w-medium">
                    <div className="flex items-center justify-evenly">                        
                        {finishes.map((item, index) => (
                            <Link
                                href={route('Acabamentos.acabamento', {slug: item.slug})}
                                key={index} 
                                className={`relative font-secondary text-xl text-neutral-800 font-light uppercase transition-all duration-300 hover:opacity-70 !text-opacity-0 after:content-[attr(data-after)] after:text-neutral-800 after:leading-none after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:whitespace-nowrap after:transition-all duration-300 after:duration-300 ${
                                    current === item.slug 
                                        ? 'after:text-opacity-100 after:font-bold ' 
                                        : 'text-neutral-700'
                                }`}
                                data-after={item.nome}
                            >
                                {item.nome}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};