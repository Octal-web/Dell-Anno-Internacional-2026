export const PolicyText = ({ content }) => {
    return (
        <>
            <section className="mt-30 mb-12 sm:mb-20">
                <div className="container max-w-small">
                    <h2 className="text-3xl md:text-4xl 2xl:text-[45px] text-center font-light uppercase tracking-wide leading-snug mb-6 md:mb-8 2xl:mb-10">{content.titulo}</h2>
                </div>
            </section>

            <section className="mb-30">
                <div className="container max-w-medium">
                    <div className="font-secondary font-light text-center sm:tracking-wide sm:leading-loose text-justify" dangerouslySetInnerHTML={{ __html: content.texto }}>
                    </div>
                </div>
            </section>
        </>
    );
};