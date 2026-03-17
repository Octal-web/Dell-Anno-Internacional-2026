import { HomeCampaignSlides } from './HomeCampaignSlides';

export const HomeCampaigns = ({ campaigns }) => {
    return (
        <section className="pt-20 md:pt-30 2xl:mt-20">
            <div className="container max-w-large">
                {/* <Reveal direction="bottom" scale={true}>
                    <h2 className="text-3xl md:text-4xl 2xl:text-[45px] text-center font-light uppercase tracking-wide leading-snug mb-6 2xl:mb-10">
                        {content.titulo}
                    </h2>
                    <p className="font-secondary text-center font-light leading-relaxed tracking-wide max-w-5xl mx-auto mb-20">
                        {content.texto}
                    </p>
                </Reveal> */}

                <HomeCampaignSlides slides={campaigns} />
            </div>
        </section>
    );
};