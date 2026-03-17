import { Link } from '@inertiajs/react';

import { AboutOriginSlides } from './AboutOriginSlides';
import { Reveal } from './Reveal';

export const AboutOrigin = ({ content, images }) => {
    return (
        <section className="pt-10 md:pt-24 pb-10 2xl:py-30 2xl:mt-10">
            <div className="container max-w-large">
                <Reveal direction="bottom" scale={true}>
                    <h2 className="text-3xl md:text-4xl 2xl:text-[45px] text-center font-light uppercase tracking-wide leading-snug mb-6 md:mb-8 2xl:mb-10">{content.titulo}</h2>
                    <p className="font-secondary text-center font-light max-md:text-justify md:leading-loose md:tracking-wide max-w-4xl mx-auto mb-16 md:mb-24">
                        {content.texto}
                    </p>
                </Reveal>

                <AboutOriginSlides slides={images} />

                <Link href={route('Produtos.index')} className="block w-fit mx-auto font-light text-center uppercase border border-black px-8 py-2 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white">Our Projects</Link>
            </div>
        </section>
    );
};