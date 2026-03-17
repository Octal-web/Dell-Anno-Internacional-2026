export const StoreProjectDetails = ({ data }) => {
    return (
        <section className="py-12 md:py-16">
            <div className="container max-w-large">
                <div className="max-w-[1250px] [&_h1]:text-4xl [&_h1]:2xl:text-[45px] [&_h1]:font-light [&_h1]:uppercase [&_h1]:tracking-wide [&_h1]:leading-snug [&_h1]:mb-6 md:[&_h1]:mb-8 2xl:[&_h1]:mb-10 [&_p_+_p]:mt-6 [&_p]:font-secondary [&_p]:font-light max-md:[&_p]:text-justify" dangerouslySetInnerHTML={{ __html: data }} />
            </div>
        </section>
    );
};