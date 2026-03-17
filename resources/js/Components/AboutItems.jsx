import { Reveal } from './Reveal';

export const AboutItems = ({ items }) => {
    return (
        <section className="py-16 md:py-20">
            <div className="container max-w-medium">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-10">
                    {items.map((item, index) => (
                        <Reveal key={index} delay={index} scale={true}>
                            <img src={item.imagem} className="w-full mb-4 md:mb-8" />
                            <h4 className="text-2xl text-center font-light uppercase">{item.titulo}</h4>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};