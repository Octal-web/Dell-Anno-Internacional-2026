import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from '@inertiajs/react';

export const ProductBanner = ({ products, content }) => {
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
        <>
            <section
                ref={productBgRef}
                className="relative h-[280px] max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%]"
                style={{
                    backgroundImage: `url(${content.imagem})`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-0 bg-black opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl md:text-5xl 2xl:text-[55px] text-white font-light uppercase sm:tracking-wide sm:leading-snug whitespace-nowrap">{content.titulo}</h1>
                </div>
            </section>

            <div className="py-10 bg-black">
                <div className="container max-w-small">
                    <div className="flex items-center justify-evenly">
                        {products.map((product, index) => (
                            <Link key={index} href={route('Produtos.produto', {slug: product.slug})} className="group relative font-secondary text-xl text-white font-light transition-all duration-300 hover:opacity-70">
                                <span className="inline-block transition-all duration-300 group-hover:-translate-x-2">//</span>
                                {product.nome}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};