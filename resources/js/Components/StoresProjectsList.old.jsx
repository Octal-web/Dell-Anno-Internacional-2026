import { Link } from '@inertiajs/react';
import { Reveal } from './Reveal';

export const StoresProjectsList = ({ content, data }) => {
    return (
        <>
            <section className="pt-8 md:pt-12 2xl:pt-20">
                <div className="container max-w-x-large">
                    <h2 className="text-3xl sm:text-4xl 2xl:text-[45px] font-light text-center uppercase tracking-wide leading-snug max-w-[970px] mx-auto mb-10">{content.titulo}</h2>
                    <p className="font-secondary text-justify md:text-center font-light sm:leading-loose whitespace-pre-line max-w-[830px] mx-auto">{content.texto}</p>
                </div>
            </section>

            <section className="pt-32 pb-44">
                <div className="space-y-30">
                    {data.map((item, index) => (
                        <div className="grid grid-cols-2 items-center group/row" key={index}>
                            <Reveal direction="left" scale={true} delay={index} className="group">
                                <Link href={route('Lojas.Projetos.projeto', {slug: item.slug})} className="block overflow-hidden">
                                    <img src={item.imagem} className="transition-all duration-300 group-hover:scale-105" />
                                </Link>
                            </Reveal>

                            <Reveal direction="right" className="pl-16 group-odd/row:pl-0 ml-0 group-odd/row:ml-auto group-odd/row:pr-16 w-full max-w-[768px] group-odd/row:-order-1">
                                <Link href={route('Lojas.Projetos.projeto', {slug: item.slug})} className="block my-4 md:my-6">
                                    <h2 className="text-3xl sm:text-4xl 2xl:text-[45px] font-light uppercase leading-tight tracking-wide">{item.nome}</h2>
                                </Link>

                                <h5 className="text-2xl text-[26px] font-light uppercase mb-10">{item.dados}</h5>

                                <p className="font-secondary mb-12 font-secondary font-light leading-loose max-w-[530px]">{item.chamada}</p>
                                
                                <Link href={route('Lojas.Projetos.projeto', {slug: item.slug})} className="mt-auto mr-auto border border-neutral-800 bg-white font-light text-center uppercase py-2 px-8 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white">View Project</Link>
                            </Reveal>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};