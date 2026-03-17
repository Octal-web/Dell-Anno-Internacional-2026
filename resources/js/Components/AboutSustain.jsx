import { Reveal } from './Reveal';

export const AboutSustain = ({ firstContent, secondContent }) => {
    return (
        <>
            <section className="pt-16 sm:pt-20 md:pt-24 2xl:pt-32">
                <div className="container max-w-large">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                        <Reveal direction="left" className="max-w-[625px] ml-auto max-md:mt-12 md:pr-16">
                            <h2 className="text-3xl sm:text-4xl 2xl:text-[45px] font-light uppercase tracking-wide leading-snug mb-6 md:mb-8 2xl:mb-10">{firstContent.titulo}</h2>

                            <div className="font-secondary font-light max-md:text-justify md:leading-loose md:tracking-wide" dangerouslySetInnerHTML={{ __html: firstContent.texto }} />
                        </Reveal>

                        <Reveal direction="right" className="max-md:-order-1">
                            <img src={firstContent.imagem} className="w-full" />
                        </Reveal>
                    </div>
                </div>
            </section>
            
            <section className="pt-16 sm:pt-20 md:pt-24 2xl:pt-32">
                <div className="container max-w-large">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                        <Reveal direction="left">
                            <img src={secondContent.imagem} className="w-full" />
                        </Reveal>

                        <Reveal direction="right" className="max-w-[625px] max-md:mt-12 md:pl-16">
                            <img src="/site/img/sustain-stamp.png" className="w-60 mb-10" />
                            <div className="font-secondary font-light max-md:text-justify md:leading-loose md:tracking-wide" dangerouslySetInnerHTML={{ __html: secondContent.texto }} />
                        </Reveal>
                    </div>
                </div>
            </section>
        </>
    );
};