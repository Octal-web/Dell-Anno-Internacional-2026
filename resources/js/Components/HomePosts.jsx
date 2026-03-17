import { Link } from '@inertiajs/react';

import { Reveal } from './Reveal';
import { HomePostsSlides } from './HomePostsSlides';

export const HomePosts = ({ content, posts }) => {
    return (
        <section className="py-20 md:py-30 2xl:mt-20 sm:mb-10">
            <div className="container max-w-large">
                <Reveal direction="bottom" scale={true}>
                    <h2 className="text-3xl md:text-4xl 2xl:text-[45px] text-center font-light uppercase tracking-wide leading-snug mb-6 2xl:mb-10">
                        {content.titulo}
                    </h2>
                    <p className="font-secondary text-center font-light max-md:text-justify md:leading-loose md:tracking-wide whitespace-pre-line max-w-4xl md:px-20 mx-auto">
                        {content.texto}
                    </p>

                    <Link href={route('Blog.index')} className="block w-fit mx-auto font-light text-center uppercase border border-black px-8 py-2 mt-10 md:mt-16 mb-20 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white" aria-label="See news">See More</Link>
                </Reveal>

                <HomePostsSlides slides={posts} />
            </div>
        </section>
    );
};