import { Link } from "@inertiajs/react";

export const InspirationLinks = () => {
    return (
        <section className="py-16 md:py-24 2xl:py-30">
            <div className="container max-w-large">
                <div className="grid grid-cols-1 md:grid-cols-3 max-sm:gap-y-10 gap-x-8">
                    <Link href={route('Showrooms.index')} className="group">
                        <div className="overflow-hidden mb-4 md:mb-10">
                            <img src="/site/img/inspiration-1.jpg" className="transition-all duration-500 group-hover:scale-110" alt="Showrooms" />
                        </div>
                        <h3 className="text-xl md:text-2xl 2xl:text-[30px] font-light text-center uppercase tracking-wide">// Showrooms</h3>
                    </Link>
                    
                    <Link href={route('Lojas.Projetos.index')} className="group">
                        <div className="overflow-hidden mb-4 md:mb-10">
                            <img src="/site/img/inspiration-2.jpg" className="transition-all duration-500 group-hover:scale-110" alt="Projects" />
                        </div>
                        <h3 className="text-xl md:text-2xl 2xl:text-[30px] font-light text-center uppercase tracking-wide">// Projects</h3>
                    </Link>
                    
                    <Link href={route('Mostras.index')} className="group">
                        <div className="overflow-hidden mb-4 md:mb-10">
                            <img src="/site/img/inspiration-3.jpg" className="transition-all duration-500 group-hover:scale-110" alt="Decoration Fairs" />
                        </div>
                        <h3 className="text-xl md:text-2xl 2xl:text-[30px] font-light text-center uppercase tracking-wide">// Decoration Fairs</h3>
                    </Link>
                </div>
            </div>
        </section>
    );
};