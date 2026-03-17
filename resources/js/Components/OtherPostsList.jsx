import { Link } from '@inertiajs/react';
import { Reveal } from './Reveal';

export const OtherPostsList = ({ posts }) => {
    return (
        <>
            <section className="pt-10 md:pt-20 pb-10">
                <div className="container max-w-large">
                    <div className="flex items-center justify-between gap-10 md:gap-20">
                        <h3 className="text-xl md:text-2xl 2xl:text-[30px] font-light uppercase tracking-wide leading-snug whitespace-nowrap">Discover more</h3>
                        
                        <Link href={route('Blog.index')} className="mt-auto md:mx-4 border border-neutral-800 bg-white max-sm:text-sm font-light text-center uppercase max-sm:tracking-tight py-2 px-2 sm:px-4 md:px-8 sm:min-w-44 transition-all hover:bg-black hover:text-white">All News</Link>
                    </div>
                </div>
            </section>

            <section className="pt-2 md:pt-10 pb-20 md:pb-30 2xl:pb-44">
                <div className="container max-w-large">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 md:gap-x-8 max-md:gap-y-14">
                        {posts.map((post, index) => (
                            <Reveal direction="bottom" scale={true} className="group flex flex-col" key={index}>
                                <Link href={route('Blog.post', {slug: post.slug})} className="overflow-hidden aspect-[5/4] md:aspect-[13/9]">
                                    <img src={post.imagem} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" alt={post.titulo} />
                                </Link>

                                <div className="font-secondary text-neutral-500 max-sm:text-xs max-md:text-sm font-light mt-2 md:mt-6">
                                    {post.data} | {post.categoria}
                                </div>
                                
                                <Link href={route('Blog.post', {slug: post.slug})} className="block my-4 md:my-6 transition-all hover:opacity-70">
                                    <h3 className="text-lg sm:text-xl md:text-2xl 2xl:text-[26px] min-h-12 sm:min-h-16 font-light max-sm:leading-tight max-w-sm line-clamp-2 mb-auto">{post.titulo}</h3>
                                </Link>

                                <p className="font-secondary max-sm:text-sm font-light sm:tracking-wide line-clamp-4 sm:line-clamp-5 max-w-md mb-5 md:mb-8 2xl:mb-10">{post.previa}</p>
                                    
                                <Link href={route('Blog.post', {slug: post.slug})} className="mt-auto mr-auto border border-neutral-800 bg-white font-light text-center uppercase py-1.5 px-3 md:p-2 sm:min-w-44 transition-all hover:bg-black hover:text-white">Read More</Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};