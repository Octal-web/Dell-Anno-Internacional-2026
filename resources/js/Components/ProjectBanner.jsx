import React, { useEffect, useRef } from 'react';

// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const ProjectBanner = ({ project }) => {
    // const projectBgRef = useRef(null);

    // useEffect(() => {  
    //     gsap.registerPlugin(ScrollTrigger);     
    //     gsap.fromTo(projectBgRef.current, 
    //     {
    //         backgroundPositionY: '100%',
    //     },
    //     {
    //         backgroundPositionY: '0%',
    //         duration: 1,
    //         ease: 'none',
    //         scrollTrigger: {
    //             trigger: projectBgRef.current,
    //             start: 'top bottom',
    //             end: 'bottom top',
    //             scrub: true
    //         }
    //     });
    // }, []);
    
    return (
        <>
            <section className="pt-16 md:pt-20 mb-10">
                <div className="container max-w-x-large">
                    <div className="">
                        <h1 className="text-4xl md:text-5xl 2xl:text-[55px] text-center font-light uppercase tracking-wide leading-snug mb-6">/ {project.nome}</h1>
                        <p className="font-secondary font-light text-justify md:text-center whitespace-pre-line max-w-6xl mx-auto">{project.descricao}</p>
                    </div>
                </div>
            </section>

            {/* <section className="pt-20 pb-36">
                <div
                    ref={projectBgRef}
                    className="relative aspect-[192/71] max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%]"
                    style={{
                        backgroundImage: `url(${project.banner})`,
                    }}
                />
            </section> */}
        </>
    );
};