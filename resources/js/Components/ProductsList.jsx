import { Link } from '@inertiajs/react';
import { Reveal } from './Reveal';

export const ProductsList = ({ content, products }) => {
    return (
        <>
            <section className="pt-8 md:pt-12 2xl:pt-20">
                <div className="container max-w-x-large">
                    <div className="flex-col md:flex-row flex items-center gap-10 md:gap-20">
                        <h1 className="text-4xl md:text-5xl 2xl:text-[55px] font-light uppercase sm:tracking-wide leading-snug whitespace-nowrap">/ {content.titulo}</h1>
                        <p className="font-secondary font-light max-md:text-justify whitespace-pre-line">{content.texto}</p>
                    </div>
                </div>
            </section>

            <section className="pt-20 mb-10 md:mb-30 2xl:pb-44">
                <div className="container max-w-x-large">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-20">
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