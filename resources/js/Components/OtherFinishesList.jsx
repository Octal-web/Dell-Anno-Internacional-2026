import { Link } from '@inertiajs/react';
import { Reveal } from './Reveal';

export const OtherFinishesList = ({ finishes }) => {
    return (
        <>
            <section className="pt-16 md:pt-20 pb-16 md:pb-30">
                <div className="container max-w-large">
                    <h3 className="text-xl md:text-2xl 2xl:text-[30px] font-light uppercase tracking-wide leading-snug whitespace-nowrap mb-14 md:mb-20 pb-14 border-b">Discover more</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-x-8">
                        {finishes.map((item, index) => (
                            <Reveal direction="bottom" scale={true} delay={index} className="group flex flex-col" key={index}>
                                <Link href={route('Acabamentos.acabamento', {slug: item.slug})} className="overflow-hidden aspect-[69/89]">
                                    <img src={item.imagem} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" alt={item.nome} />
                                </Link>
                                    
                                <Link href={route('Acabamentos.acabamento', {slug: item.slug})} className="block my-4 md:my-6 transition-all hover:opacity-70">
                                    <h3 className="text-xl 2xl:text-[22px] font-light uppercase line-clamp-2 text-center">{item.nome}</h3>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};