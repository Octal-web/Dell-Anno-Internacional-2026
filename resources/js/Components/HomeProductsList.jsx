import { Reveal } from "./Reveal";

export const HomeProductsList = ({ content, products, current, setCurrent }) => {
    return (
        <div className="pt-20 md:pt-30 md:pb-10">
            <div className="container max-w-large">
                <Reveal direction="bottom" scale={true}>
                    <h2 className="text-3xl md:text-4xl 2xl:text-[45px] text-center font-light uppercase tracking-wide leading-snug mb-6 md:mb-8 2xl:mb-10">{content.titulo}</h2>
                    <p className="font-secondary font-light text-center max-md:text-justify sm:tracking-wide whitespace-pre-line max-w-[1080px] sm:leading-loose mx-auto mb-10 md:mb-16 2xl:mb-20">{content.texto}</p>
                </Reveal>
                
                <div className="flex items-center justify-center gap-10 border-b">
                    {products.map((item, index) => (
                        <button key={index} onClick={() => setCurrent(item)} className="relative px-4 md:px-8 py-8 md:py-12 text-xl md:text-2xl text-neutral-600 font-light uppercase transition-all hover:text-neutral-800 after:absolute after:-bottom-px after:left-0 after:right-0 after:h-px after:bg-opacity-0 after:bg-neutral-400 hover:after:bg-opacity-100 after:transition-all" aria-label={item.nome}>{item.nome}</button>
                    ))}
                </div>
            </div>
        </div>
    );
};