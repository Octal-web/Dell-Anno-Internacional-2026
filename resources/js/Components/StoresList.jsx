import { Link } from '@inertiajs/react';
import { Reveal } from './Reveal';

export const StoresList = ({ content, loading, stores }) => {
    return (
        <>
            <section className="pt-8 md:pt-12 2xl:pt-20">
                <div className="container max-w-x-large">
                    <h1 className="text-4xl md:text-5xl 2xl:text-[55px] font-light uppercase sm:tracking-wide mb-6 md:mb-10">{content.titulo}</h1>
                    <p className="font-secondary font-light max-sm:text-justify sm:tracking-wide sm:leading-loose whitespace-pre-line max-w-[830px] mb-8 2xl:mb-10">{content.texto}</p>
                </div>
            </section>

            <section className="pt-10 md:pt-20 pb-20 md:pb-30 2xl:pb-40">
                <div className="container max-w-x-large">
                    {stores.length ? (
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-16 md:gap-y-20${loading ? ' opacity-50' : ''}`}>
                            {stores.map((store, index) => {
                                const isExternalLink = store.link_lp;
                                const linkUrl = isExternalLink ? store.link_lp : route('Lojas.loja', {slug: store.slug});
                                
                                const imageElement = (
                                    <img src={store.imagem} className="transition-all duration-500 group-hover:scale-110" alt={store.cidade} />
                                );
                                
                                const titleElement = (
                                    <h3 className="text-2xl font-light max-sm:tracking-tight uppercase mx-2 sm:mx-4">Dell Anno {store.cidade + ' - ' + store.estado}</h3>
                                );
                                
                                const buttonElement = (
                                    <span className="block mt-auto border border-neutral-800 bg-white max-sm:text-sm font-light text-center uppercase whitespace-nowrap p-2 sm:min-w-44 transition-all hover:bg-black hover:text-white">
                                        Discover More
                                    </span>
                                );

                                return (
                                    <Reveal direction="bottom" scale={true} delay={index} className="group flex flex-col items-start h-full" key={index}>
                                        {isExternalLink ? (
                                            <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="overflow-hidden" aria-label={store.cidade}>
                                                {imageElement}
                                            </a>
                                        ) : (
                                            <Link href={linkUrl} className="overflow-hidden">
                                                {imageElement}
                                            </Link>
                                        )}
                                        
                                        {isExternalLink ? (
                                            <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block my-4 md:my-6">
                                                {titleElement}
                                            </a>
                                        ) : (
                                            <Link href={linkUrl} className="block my-4 md:my-6" aria-label={store.cidade}>
                                                {titleElement}
                                            </Link>
                                        )}
                                        
                                        <div className="flex items-end justify-between w-full max-w-[780px] pr-4">
                                            <p className="font-secondary max-sm:text-sm font-light sm:tracking-wide whitespace-pre-line max-w-md mx-2 sm:mx-4">
                                                {store.endereco}
                                                <br />
                                                {store.contato?.split('\n')[0]}
                                            </p>

                                            {isExternalLink ? (
                                                <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="mb-2" aria-label={store.cidade}>
                                                    {buttonElement}
                                                </a>
                                            ) : (
                                                <Link href={linkUrl} className="mb-2" aria-label={store.cidade}>
                                                    {buttonElement}
                                                </Link>
                                            )}
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>
                        )
                        : <p className="text-xl text-center my-20">None stores were found.</p>
                    }
                </div>
            </section>
        </>
    );
};