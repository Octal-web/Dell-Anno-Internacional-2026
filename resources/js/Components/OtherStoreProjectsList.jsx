import { Link } from '@inertiajs/react';
import { Reveal } from './Reveal';

export const OtherStoreProjectsList = ({ projects }) => {
    return (
        <>
            <section className="pt-8 md:pt-12 2xl:pt-20">
                <div className="container max-w-x-large">
                    <div className="flex items-center justify-between gap-10 md:gap-20">
                        <h3 className="text-xl md:text-2xl 2xl:text-[30px] font-light uppercase tracking-wide leading-snug whitespace-nowrap">Discover more</h3>
                        
                        <Link href={route('Produtos.index')} className="mt-auto md:mx-4 border border-neutral-800 bg-white max-sm:text-sm font-light text-center uppercase max-sm:tracking-tight py-2 px-2 sm:px-4 md:px-8 sm:min-w-44 transition-all hover:bg-black hover:text-white">All Environments</Link>
                    </div>
                </div>
            </section>

            <section className="pt-10 pb-24">
                <div className="container max-w-x-large">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-5 pt-16 border-t">
                        {projects.map((project, index) => (
                            <Reveal direction="bottom" scale={true} delay={index} className="group flex flex-col items-start h-full" key={index}>
                                <Link href={route('Lojas.Projetos.projeto', {slug: project.slug})} className="overflow-hidden aspect-[8/7]">
                                    <img src={project.imagem} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" alt={project.nome} />
                                </Link>
                                
                                <Link href={route('Lojas.Projetos.projeto', {slug: project.slug})} className="block my-4 md:my-6">
                                    <h4 className="text-xl font-light">{project.nome}</h4>
                                </Link>
                                
                                <Link href={route('Lojas.Projetos.projeto', {slug: project.slug})} className="mt-auto border border-neutral-800 bg-white font-light text-center uppercase p-2 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white">View Project</Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};