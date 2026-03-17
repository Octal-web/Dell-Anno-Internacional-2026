export const FairYearBanner = ({ data }) => {
    return (
        <section className="pt-16 md:pt-24 2xl:pt-30">
            <div className="container max-w-x-large">
                <h2 className="text-3xl sm:text-4xl 2xl:text-[45px] font-light text-center uppercase tracking-wide leading-snug max-w-[750px] mx-auto mb-6 md:mb-8 2xl:mb-10">{data.nome}</h2>
                <p className="font-secondary text-justify md:text-center font-light sm:leading-loose whitespace-pre-line max-w-[830px] mx-auto">{data.descricao}</p>
            </div>
        </section>
    );
};