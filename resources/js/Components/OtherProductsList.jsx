import { Link } from '@inertiajs/react';
import { Reveal } from './Reveal';

export const OtherProductsList = ({ products }) => {
    return (
        <>
            <section className="pt-8 md:pt-12 2xl:pt-20">
                <div className="container max-w-x-large">
                    <div className="flex items-center justify-between gap-10 md:gap-20">
                        <h3 className="text-xl md:text-2xl 2xl:text-[30px] font-light uppercase tracking-wide leading-snug whitespace-nowrap">Discover more</h3>
                        
                        <Link href={route('Produtos.index')} className="mt-auto md:mx-4 border border-neutral-800 bg-white max-sm:text-sm font-light text-center uppercase max-sm:tracking-tight py-2 px-2 sm:px-4 md:px-8 sm:min-w-44 transition-all hover:bg-black hover:text-white" alt="All Environments">All Environments</Link>
                    </div>
                </div>
            </section>

            <section className="pt-8 sm:pt-10 pb-30 2xl:pb-44">
                <div className="container max-w-x-large">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-20 pt-12 sm:pt-16 border-t">
                        {products.map((product, index) => (
                            <Reveal direction="bottom" scale={true} delay={index} className="group flex flex-col items-start h-full" key={index}>
                                <Link href={route('Produtos.produto', {slug: product.slug})} className="overflow-hidden" aria-label={product.nome}>
                                    <img src={product.imagem} className="transition-all duration-500 group-hover:scale-110" alt={product.nome} />
                                </Link>
                                
                                <Link href={route('Produtos.produto', {slug: product.slug})} className="block my-4 2xl:my-6" aria-label={product.nome}>
                                    <h3 className="text-3xl font-light uppercase mx-4">{product.nome}</h3>
                                </Link>
                                
                                <p className="font-secondary font-light sm:tracking-wide max-w-md mx-4 mb-8 2xl:mb-10">{product.descricao}</p>
                                
                                <Link href={route('Produtos.produto', {slug: product.slug})} className="mt-auto mx-4 border border-neutral-800 bg-white font-light text-center uppercase p-2 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white" aria-label={product.nome}>Discover More</Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};