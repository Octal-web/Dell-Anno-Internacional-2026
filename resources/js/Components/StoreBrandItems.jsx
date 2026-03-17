import { Reveal } from './Reveal';

export const StoreBrandItems = ({ content }) => {
    return (
        <section className="py-16 md:py-20">
            <div className="container max-w-large">
                <Reveal direction="bottom" scale={true}>
                    <h2 className="text-3xl text-center font-light uppercase sm:tracking-wide sm:leading-snug mb-6 md:mb-8 2xl:mb-10">{content.titulo}</h2>
                    <div className="font-secondary text-center font-light max-md:text-justify md:leading-loose md:tracking-wide max-w-7xl mx-auto mb-5 md:mb-24 [&_table]:mt-10 sm:[&_table]:mt-16 md:[&_table]:mt-24 [&_table]:relative [&_table]:mx-auto [&_table]:leading-normal [&_tr]:grid [&_tr]:grid-cols-1 md:[&_tr]:grid-cols-3 max-md:[&_tr:fist-child]:gap-4 max-md:[&_tr:last-child]:gap-[3.6rem] max-md:[&_tr:last-child]:mt-5 max-md:[&_tr:last-child]:translate-x-6 md:[&_tr]:gap-20 max-md:[&_tr:first-child]:absolute max-md:[&_tr:first-child]:-left-20 [&_tr]:items-center [&_th]:relative [&_th]:before:absolute [&_th]:before:top-0 [&_th]:before:-left-10 [&_th]:before:h-[170px] [&_th]:before:w-px [&_th]:before:bg-neutral-200 [&_th:first-child]:before:hidden [&_tr_th_img]:mx-auto [&_tr_th_img]:mb-3 [&_td_strong]:font-medium max-md:[&_th]:before:content-none" dangerouslySetInnerHTML={{ __html: content.texto }} />
                </Reveal>
            </div>
        </section>
    );
};