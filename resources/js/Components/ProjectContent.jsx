import { Reveal } from "./Reveal";

export const ProjectContent = ({ banner, text }) => {
    return (
        <>
            {/* {banner ? (
                <Reveal direction="bottom" scale={true}>
                    <img src={banner} className="w-full pb-20" />
                </Reveal>
            ) : null } */}

            <section className="pb-12 2xl:pb-20">
                <div className="container max-w-x-large">
                    <div className="pt-16 md:pt-24 border-t max-sm:[&_p]:text-justify text-center [&_h3]:text-3xl sm:[&_h3]:text-4xl [&_h3]:2xl:text-[45px] [&_h3]:font-light [&_h3]:uppercase sm:[&_h3]:!leading-snug [&_h3]:mx-auto sm:[&_h3]:tracking-wider [&_h3]:mb-6 [&_h3]:max-w-[980px] [&_p]:font-secondary [&_p]:font-light [&_p]:!leading-relaxed [&_p]:tracking-wide [&_p]:mb-12 md:[&_p]:mb-20 [&_p]:max-w-[980px] [&_p]:mx-auto [&_img]:mx-auto [&_img]:max-h-[85vh]" dangerouslySetInnerHTML={{ __html: text }} />
                </div>
            </section>
        </>
    );
};