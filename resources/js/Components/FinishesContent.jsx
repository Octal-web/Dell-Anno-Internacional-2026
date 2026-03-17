import { Reveal } from "./Reveal";

export const FinishesContent = ({ blocks }) => {
    if (blocks.length === 0) return;
    
    return (
        <section>
            {blocks.map((item, index) => (
                <div key={index} className="pt-20 2xl:pt-24 md:pb-10 2xl:pb-14 grid grid-cols-1 md:grid-cols-2 max-md:gap-10 items-center group/row">
                    <Reveal direction="right">
                        <img src={item.imagem} className="w-full" />
                    </Reveal>

                    <Reveal className="max-w-[54rem] md:group-odd/row:pl-[10%] md:ml-16 md:pr-[10%] md:group-odd/row:pr-16 md:group-odd/row:ml-auto w-full flex items-center md:group-odd/row:-order-1 max-md:px-[5%]" direction="left">
                        <div className="[&_img]:mb-6 md:[&_img]:mb-20 max-md:[&_img]:max-w-[40%] [&_h3]:text-3xl [&_h3]:sm:text-4xl [&_h3]:2xl:text-[45px] [&_h3]:font-light [&_h3]:uppercase [&_h3]:!leading-snug [&_h3]:tracking-wider [&_h3]:mb-6 [&_h3]:max-w-[980px] [&_p]:font-secondary [&_p]:font-light [&_p]:max-w-xl max-md:[&_p]:text-justify [&_p]:!leading-relaxed [&_p]:tracking-wide" dangerouslySetInnerHTML={{ __html: item.texto }} />
                    </Reveal>
                </div>
            ))}
        </section>
    )
};