import { Link } from '@inertiajs/react';
import { Reveal } from './Reveal';

export const FairsList = ({ content, fairs }) => {
    return (
        <>
            <section className="pt-8 md:pt-12 2xl:pt-20">
                <div className="container max-w-x-large">
                    <h2 className="text-3xl sm:text-4xl 2xl:text-[45px] font-light text-center uppercase sm:tracking-wide sm:leading-snug max-w-[750px] mx-auto mb-8 2xl:mb-10">{content.titulo}</h2>
                    <p className="font-secondary text-justify md:text-center font-light sm:leading-loose whitespace-pre-line max-w-[830px] mx-auto">{content.texto}</p>
                </div>
            </section>

            <section className="pt-20 md:pt-32 pb-30 md:pb-36 2xl:pb-44">
                <div className="space-y-30">
                    {fairs.map((item, index) => (
                        <div className="grid grid-cols-1 md:grid-cols-2 max-md:gap-12 group/row" key={index}>
                            <Reveal direction="left" scale={true} delay={index} className="aspect-[96/65] object-cover">
                                {item.anos.length > 0 ? (
                                    <div className="">
                                        <img src={item.imagem} className="" />
                                    </div>
                                ) : (
                                    <Link href={route('Mostras.mostra', {slug: item.slug})} className="block group overflow-hidden">
                                        <img src={item.imagem} className=" aspect-[96/65] object-cover transition-all duration-500 group-hover:scale-110" alt={item.nome} />
                                    </Link>
                                )}
                            </Reveal>

                            <Reveal direction="right" className="px-[5%] md:px-16 ml-0 group-odd/row:ml-auto w-full max-w-[768px] md:group-odd/row:-order-1">
                                <h2 className="text-3xl sm:text-4xl 2xl:text-[45px] font-light uppercase md:leading-tight md:tracking-wide mb-6">{item.nome}</h2>
                                <p className="mb-8 md:mb-12 font-secondary font-light max-md:text-justify md:leading-loose max-w-[590px]">{item.descricao}</p>
                                
                                {item.anos.length > 0 ? (
                                    <>
                                        <p className="mb-4 md:mb-8 font-secondary font-bold leading-loose">select the fair year:</p>

                                        <div className="grid grid-cols-3 gap-4 w-5/6 max-w-[575px]">
                                            {item.anos.map((ano, idx) => (
                                                <Link key={idx} href={route('Mostras.mostra.ano', {slug: item.slug, ano: ano.ano})} className="mt-auto block border border-neutral-800 bg-white font-light text-center uppercase py-2 px-4 md:px-8 2xl:min-w-44 transition-all hover:bg-black hover:text-white">{ano.ano}</Link>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <Link href={route('Mostras.mostra', {slug: item.slug})} className="mt-auto block w-fit border border-neutral-800 bg-white font-light text-center uppercase py-2 px-8 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white">See more</Link>
                                )}
                            </Reveal>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};