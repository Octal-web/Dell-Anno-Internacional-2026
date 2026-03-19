import { Link } from '@inertiajs/react';
import { Reveal } from "./Reveal";

export const StoreProjectGrid = ({ projects }) => {

    return (
        <>            
            <section className="pb-10 2xl:pb-20 2xl:mt-20">
                <div className="container max-w-large">
                    <Reveal direction="bottom" scale={true}>
                        <h2 className="text-3xl text-center font-light uppercase sm:tracking-wide sm:leading-snug mb-6 md:mb-8 2xl:mb-10">
                            Project Gallery
                        </h2>
                        <p className="font-secondary text-center font-light max-md:text-justify md:leading-loose md:tracking-wide max-w-4xl mx-auto mb-10 md:mb-16 2xl:mb-24">
                            Explore a curated selection of our finest projects, where design meets purpose and elegance shapes every detail.
                        </p>
                    </Reveal>
                </div>

                <div className="container max-w-x-large">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 md:gap-y-20">
                        {projects.map((item, index) => (
                            <Reveal scale={true} key={index} delay={index * 0.8} className="relative overflow-hidden aspect-[5/4]">
                                <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover" />
                                <Link 
                                    href={route('Lojas.Projetos.projeto', {slug: item.slug})}
                                    className="group text-left absolute inset-0"
                                >
                                    <div className="hidden md:block absolute inset-0 bg-black opacity-0 transition-all duration-300 group-hover:opacity-50" />
                                    <div className="hidden md:block absolute left-6 bottom-6 right-6 translate-y-20 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                        <p className="font-secondary text-white font-light">{item.nome}</p>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};