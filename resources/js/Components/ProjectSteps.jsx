import { useState, useEffect } from 'react';

import { Reveal } from './Reveal';
import { Link } from '@inertiajs/react';

export const ProjectSteps = ({ content, steps, noExternal = false }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section className={`py-16 md:py-30 ${noExternal ? '' : 'mb-8 2xl:mb-20'}`}>
            <div className="container max-w-large">
                <h2 className="text-3xl text-center font-light uppercase sm:tracking-wide sm:leading-snug mb-8">{content.titulo}</h2>
                <p className="font-secondary text-xl font-medium text-center uppercase">{content.subtitulo}</p>
                {steps.map((item, index) => {
                    const isEven = index % 2 === 0;
                    const imageFirst = isMobile || isEven;
                    
                    return (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 items-center my-16 2xl:my-20 border-y">
                            {imageFirst ? (
                                <>
                                    <Reveal direction="left">
                                        <img src={item.imagem} className={`w-full ${isMobile ? 'mb-8' : ''}`} />
                                    </Reveal>
                                    <Reveal direction="right" className={`max-w-[625px] w-full ${isMobile ? '' : 'pl-16'}`}>
                                        <h4 className="text-xl 2xl:text-[20px] font-medium uppercase tracking-wide leading-snug mb-8">{index + 1 + ' - ' + item.titulo}</h4>
                                        <div className="font-secondary font-light leading-relaxed tracking-wide max-md:pb-6">{item.descricao}</div>
                                    </Reveal>
                                </>
                            ) : (
                                <>
                                    <Reveal direction="left" className="max-w-[625px] w-full ml-auto pr-16">
                                        <h4 className="text-xl 2xl:text-[20px] font-medium uppercase tracking-wide leading-snug mb-8">{index + 1 + ' - ' + item.titulo}</h4>
                                        <div className="font-secondary font-light leading-relaxed tracking-wide max-md:pb-6">{item.descricao}</div>
                                    </Reveal>
                                    <Reveal direction="right">
                                        <img src={item.imagem} className="w-full" />
                                    </Reveal>
                                </>
                            )}
                        </div>
                    );
                })}
                
                {!noExternal && (
                    <Link href={route('Produtos.index')} className="block w-fit mx-auto font-light text-center uppercase border border-black px-8 py-2 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white">Our Projects</Link>
                )}
            </div>
        </section>
    );
};