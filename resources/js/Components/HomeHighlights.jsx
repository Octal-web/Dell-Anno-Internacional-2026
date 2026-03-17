import { Link } from "@inertiajs/react";
import { Reveal } from "./Reveal";
import { VideoPlayer } from "./VideoPlayer";

export const HomeHighlights = ({ highlights }) => {
    const sizeClasses = {
        pequeno: "md:container md:max-w-medium",
        medio: "md:container md:max-w-large",
        grande: ""
    };

    return (
        highlights.map((item, index) => (
            <section key={index} className="pt-12 sm:pt-16 lg:pt-30 mt-10 2xl:mt-30">
                <Reveal direction="bottom" scale={true} className={sizeClasses[item.tamanho] || ""}>
                    <h2 className="text-3xl md:text-4xl 2xl:text-[45px] text-center font-light uppercase tracking-wide leading-snug mb-6 md:mb-8 2xl:mb-10 max-xl:w-[90vw] mx-auto">{item.titulo}</h2>

                    <p className="font-secondary font-light text-center max-md:text-justify sm:tracking-wide sm:leading-loose whitespace-pre-line w-[90vw] max-w-[1080px] mx-auto mb-6 md:mb-8 2xl:mb-10">{item.texto}</p>

                    {item.link && (
                        <Link href={item.link} className="block w-fit mx-auto font-light text-center uppercase border border-black px-8 py-2 my-16 2xl:my-20 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white" aria-label={item.titulo}>{item.texto_botao}</Link>
                    )}

                    {item.imagem && (
                        <img src={item.imagem} className="mx-auto mt-16 md:mt-20 max-h-[85vh] w-full object-cover" alt={item.titulo} />
                    )}

                    {item.video && (
                        <VideoPlayer video={item.video} className="mx-auto mt-16 md:mt-20 max-h-[85vh] w-full object-cover" autoPlay muted loop playsInline />
                    )}
                </Reveal>
            </section>
        ))
    );
};