import { Link } from '@inertiajs/react';
import { Reveal } from './Reveal';

export const OtherShowroomsList = ({ showrooms }) => {
    return (
        <>
            <section className="pt-8 md:pt-12 2xl:pt-20">
                <div className="container max-w-x-large">
                    <div className="flex items-center justify-between gap-10 md:gap-20">
                        <h3 className="text-xl md:text-2xl 2xl:text-[30px] font-light uppercase tracking-wide leading-snug whitespace-nowrap">Discover more</h3>
                        
                        <Link href={route('Showrooms.index')} className="mt-auto md:mx-4 border border-neutral-800 bg-white max-sm:text-sm font-light text-center uppercase max-sm:tracking-tight py-2 px-2 sm:px-4 md:px-8 sm:min-w-44 transition-all hover:bg-black hover:text-white" aria-label="All Showrooms">All Showrooms</Link>
                    </div>
                </div>
            </section>

            <section className="pt-10 pb-30 2xl:pb-44">
                <div className="container max-w-x-large">
                    <div className="grid grid-cols-4 gap-x-5 gap-y-20 pt-16 border-t">
                        {showrooms.map((showroom, index) => (
                            <Reveal direction="bottom" scale={true} delay={index} className="group flex flex-col" key={index}>
                                <Link href={route('Showrooms.showroom', {slug: showroom.slug})} className="overflow-hidden" aria-label={showroom.nome}>
                                    <img src={showroom.imagem} className="transition-all duration-500 group-hover:scale-110" alt={showroom.nome} />
                                </Link>
                                
                                <Link href={route('Showrooms.showroom', {slug: showroom.slug})} className="block my-4 md:my-6" aria-label={showroom.nome}>
                                    <h3 className="text-xl 2xl:text-[20px] font-light">{showroom.nome}</h3>
                                </Link>
                                 
                                <Link href={route('Showrooms.showroom', {slug: showroom.slug})} className="mt-auto mr-auto border border-neutral-800 bg-white font-light text-center uppercase p-2 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white" aria-label={showroom.nome}>View Showroom</Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};