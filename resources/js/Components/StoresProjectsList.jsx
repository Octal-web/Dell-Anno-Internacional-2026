import { Link } from '@inertiajs/react';
import { Reveal } from './Reveal';

export const StoresProjectsList = ({ content, data }) => {
    return (
        <>
            <section className="pt-8 md:pt-12 2xl:pt-20">
                <div className="container max-w-x-large">
                    <h2 className="text-3xl sm:text-4xl 2xl:text-[45px] font-light text-center uppercase tracking-wide leading-snug max-w-[970px] mx-auto mb-8 md:mb-10">{content.titulo}</h2>
                    <p className="font-secondary text-justify md:text-center font-light sm:leading-loose whitespace-pre-line max-w-[830px] mx-auto">{content.texto}</p>
                </div>
            </section>

            <section className="pt-20 md:pt-24 2xl:pt-30 pb-24 md:pb-32 2xl:pb-44">
                <div className="container max-w-x-large">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 md:gap-y-20">
                        {data.map((item, index) => (
                            <Reveal direction="bottom" scale={true} delay={index} className="group flex flex-col" key={index}>
                                <Link href={route('Lojas.Projetos.projeto', {slug: item.slug})} className="overflow-hidden aspect-[5/4]">
                                    <img src={item.imagem} className="transition-all duration-500 h-full object-cover group-hover:scale-110" />
                                </Link>
                                
                                <Link href={route('Lojas.Projetos.projeto', {slug: item.slug})} className="block my-4 md:my-6">
                                    <h3 className="text-xl 2xl:text-[20px] font-light">{item.nome}</h3>
                                </Link>
                                 
                                <Link href={route('Lojas.Projetos.projeto', {slug: item.slug})} className="mt-auto mr-auto border border-neutral-800 bg-white font-light text-center uppercase p-2 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white">View Project</Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};