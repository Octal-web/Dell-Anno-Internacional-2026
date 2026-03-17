import { Link } from '@inertiajs/react';
import { Reveal } from './Reveal';

export const CatalogsList = ({ catalogs }) => {
    return (
        <section className="pt-10 pb-24">
            <div className="container max-w-x-large">
                {catalogs.map((category, catIndex) => (
                    <div key={catIndex}>
                        <h2 className="text-3xl md:text-3xl md:text-4xl 2xl:text-[45px] text-center font-light uppercase tracking-wide leading-snug mb-6 2xl:mb-10">
                            {category.categoria}
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 sm:gap-x-10 md:gap-x-20 2xl:gap-x-32">
                            {category.itens.map((item, index) => (
                                <Reveal
                                    direction="bottom"
                                    scale={true}
                                    delay={index}
                                    className="flex flex-col items-start h-full"
                                    key={index}
                                >
                                <img
                                    src={item.imagem}
                                    alt={item.titulo}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />

                                <h4 className="text-xl font-light uppercase my-6">{item.titulo}</h4>

                                <p className="font-secondary font-light sm:tracking-wide max-w-md mb-8 2xl:mb-10">{item.descricao}</p>

                                <a
                                    href={route('Catalogos.download', { id: item.id })}
                                    className="mt-auto border border-neutral-800 bg-white font-light text-center uppercase p-2 min-w-36 sm:min-w-44 transition-all hover:bg-black hover:text-white"
                                >
                                    Download
                                </a>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};