import { Reveal } from './Reveal';

import { VideoPlayer } from './VideoPlayer';

export const AboutVideo = ({ content }) => {
    return (
        <section className="py-16 md:py-20 2xl:py-30 2xl:mt-10">
            <div className="container max-w-large">
                <Reveal direction="bottom" scale={true}>
                    <img src="/site/img/logo.svg" className="mx-auto mb-9 md:mb-12 w-52" />
                    <p className="font-secondary text-center font-light max-md:text-justify md:leading-loose md:tracking-wide max-w-5xl mx-auto mb-16 md:mb-24 2xl:mb-36">
                        {content.texto}
                    </p>

                    <VideoPlayer video={content.arquivo} poster={content.imagem} />
                </Reveal>
            </div>
        </section>
    );
};