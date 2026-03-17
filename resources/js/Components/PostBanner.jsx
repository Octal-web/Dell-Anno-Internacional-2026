import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const PostBanner = ({ post }) => {
    const postBgRef = useRef(null);

    useEffect(() => {  
        gsap.registerPlugin(ScrollTrigger);     
        gsap.fromTo(postBgRef.current, 
        {
            backgroundPositionY: '100%',
        },
        {
            backgroundPositionY: '0%',
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: postBgRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }, []);
    
    return (
        <section
            ref={postBgRef}
            className="relative max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%]"
            style={{
                backgroundImage: `url(${post.banner})`,
            }}
        >
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative container max-w-large">
                <div className="h-[380px] flex items-end">
                    <h2 className="text-3xl md:text-4xl 2xl:text-[45px] text-white font-light sm:leading-tight uppercase max-w-5xl mb-10">{post.titulo}</h2>
                </div>
            </div>
        </section>
    );
};