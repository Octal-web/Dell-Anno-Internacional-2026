import { VideoPlayer } from "./VideoPlayer";

export const StoreProjectBanner = ({ project }) => {
    console.log(project)
    return (
        <section className="pt-8 md:pt-12 2xl:pt-20">
            <div className="container max-w-large">
                <h2 className="text-3xl sm:text-4xl 2xl:text-[45px] font-light uppercase tracking-wide leading-snug mb-6 md:mb-8 2xl:mb-10">{project.nome}</h2>
                <div className="font-secondary font-light max-md:text-justify sm:leading-loose whitespace-pre-line" dangerouslySetInnerHTML={{ __html: project.descricao }} />
            </div>

            {project.video && (
                <div className="relative w-full aspect-video max-h-[650px] mt-20">
                    <div className="absolute inset-0">
                        <VideoPlayer video={project.video} poster={project.banner} />
                    </div>
                </div>
            )}
        </section>
    );
};