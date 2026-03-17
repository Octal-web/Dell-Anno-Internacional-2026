import { useState, useEffect } from 'react';

import { Reveal } from './Reveal';

export const AboutSteps = ({ steps }) => {
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
        <section className="pt-10 pb-20 2xl:py-30 md:mb-10">
            <div className="container max-w-large">
                {steps.map((item, index) => {
                    const isEven = index % 2 === 0;
                    const imageFirst = isMobile || isEven;
                    
                    return (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 items-center py-12 2xl:py-16">
                            {imageFirst ? (
                                <>
                                    <Reveal direction="left">
                                        <img src={item.imagem} className={`w-full ${isMobile ? 'mb-6' : ''}`} />
                                    </Reveal>
                                    <Reveal direction="right" className={`max-w-[625px] w-full ${isMobile ? '' : 'pl-16'}`}>
                                        <h2 className="text-3xl sm:text-4xl 2xl:text-[45px] font-light uppercase tracking-wide leading-snug mb-6 md:mb-8 2xl:mb-10">{item.titulo}</h2>
                                        <div className="font-secondary font-light max-md:text-justify md:leading-loose md:tracking-wide">{item.descricao}</div>
                                    </Reveal>
                                </>
                            ) : (
                                <>
                                    <Reveal direction="left" className="max-w-[625px] w-full ml-auto pr-16">
                                        <h2 className="text-3xl sm:text-4xl 2xl:text-[45px] font-light uppercase tracking-wide leading-snug mb-6 md:mb-8 2xl:mb-10">{item.titulo}</h2>
                                        <div className="font-secondary font-light max-md:text-justify md:leading-loose md:tracking-wide">{item.descricao}</div>
                                    </Reveal>
                                    <Reveal direction="right">
                                        <img src={item.imagem} className="w-full" />
                                    </Reveal>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};