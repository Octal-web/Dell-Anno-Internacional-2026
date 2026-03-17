import { useState, useEffect, forwardRef } from "react";
import { Link } from "@inertiajs/react";
import { Reveal } from "./Reveal";
import { HomeProductSlides } from "./HomeProductSlides";

export const HomeProductItem = forwardRef(({ product, isReverse }, ref) => {
    const [willInvert, setWillInvert] = useState(() => {
        if (typeof window !== "undefined") {
            return window.innerWidth < 768 ? false : isReverse;
        }
        return isReverse;
    });

    const [currentSlide, setCurrentSlide] = useState(1);
    const [swiperRef, setSwiperRef] = useState(null);

    const totalSlides = product.imagens.length;

    useEffect(() => {
        const handleResize = () => {
            setWillInvert(window.innerWidth < 768 ? false : isReverse);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isReverse]);

    const handleSlideChange = (swiper) => {
        setCurrentSlide(swiper.realIndex + 1);
    };

    const formatNumber = (num) => {
        return num.toString().padStart(2, '0');
    };

    const goToPrevSlide = () => {
        if (swiperRef) {
            swiperRef.slidePrev();
        }
    };

    const goToNextSlide = () => {
        if (swiperRef) {
            swiperRef.slideNext();
        }
    };

    return (
        <section className="pt-20 2xl:pt-24 pb-10 2xl:pb-14" ref={ref}>
            <div className="relative grid max-md:gap-10 grid-cols-1 md:grid-cols-2">
                {willInvert ? (
                    <>
                        <Reveal direction="left">
                            <HomeProductSlides 
                                slides={product.imagens} 
                                onSlideChange={handleSlideChange}
                                setSwiperRef={setSwiperRef}
                            />
                        </Reveal>

                        <Reveal direction="right" className="relative max-w-[58.5rem] pr-[10%] h-full flex items-center">  
                            <div className="absolute top-0 left-12 flex items-center mb-8 mx-4">
                                <div className="flex items-center text-gray-400 text-sm font-light sm:tracking-widest">
                                    <button 
                                        onClick={goToPrevSlide}
                                        className="mr-4 hover:text-gray-600 transition-colors disabled:opacity-50"
                                        disabled={currentSlide === 1}
                                        aria-label="Go to prev slide"
                                    >
                                        <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 2L3 9L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    
                                    <span className="mx-3">
                                        {formatNumber(currentSlide)} / {formatNumber(totalSlides)}
                                    </span>
                                    
                                    <button 
                                        onClick={goToNextSlide}
                                        className="ml-4 hover:text-gray-600 transition-colors disabled:opacity-50"
                                        disabled={currentSlide === totalSlides}
                                        aria-label="Go to next slide"
                                    >
                                        <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 16L9 9L2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="ml-12">
                                <Link href={route('Produtos.produto', {slug: product.slug})} className="block mb-10" aria-label={product.nome}>
                                    <h3 className="text-3xl font-light uppercase mx-4">{product.nome}</h3>
                                </Link>
                                
                                <p className="font-secondary font-light sm:tracking-wide whitespace-pre-line max-w-lg mx-4 mb-12">{product.descricao}</p>
                                
                                <Link href={route('Produtos.produto', {slug: product.slug})} className="mt-auto block w-fit mx-4 border border-neutral-800 bg-white font-light text-center uppercase py-2 px-8 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white" aria-label={product.nome}>Discover More</Link>
                            </div>
                        </Reveal>
                    </>
                ) : (
                    <>
                        <Reveal direction="left" className="max-w-[58.5rem] pl-[10%] h-full flex items-center">
                            <div className="absolute max-md:-bottom-[100vw] md:top-0 flex items-center md:mb-8 md:mx-4">
                                <div className="flex items-center text-gray-400 text-sm font-light sm:tracking-widest">
                                    <button 
                                        onClick={goToPrevSlide}
                                        className="mr-4 hover:text-gray-600 transition-colors disabled:opacity-50"
                                        disabled={currentSlide === 1}
                                        aria-label="Go to prev slide"
                                    >
                                        <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 2L3 9L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    
                                    <span className="mx-3">
                                        {formatNumber(currentSlide)} / {formatNumber(totalSlides)}
                                    </span>
                                    
                                    <button 
                                        onClick={goToNextSlide}
                                        className="ml-4 hover:text-gray-600 transition-colors disabled:opacity-50"
                                        disabled={currentSlide === totalSlides}
                                        aria-label="Go to next slide"
                                    >
                                        <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 16L9 9L2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="mr-12">
                                <Link href={route('Produtos.produto', {slug: product.slug})} className="block mb-6 md:mb-10" aria-label={product.nome}>
                                    <h3 className="text-3xl font-light uppercase md:mx-4">{product.nome}</h3>
                                </Link>
                                
                                <p className="font-secondary font-light sm:tracking-wide whitespace-pre-line max-w-lg md:mx-4 mb-8 md:mb-12">{product.descricao}</p>

                                <Link href={route('Produtos.produto', {slug: product.slug})} className="mt-auto block w-fit md:mx-4 border border-neutral-800 bg-white font-light text-center uppercase py-2 px-8 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white" aria-label={product.nome}>Discover More</Link>
                            </div>
                        </Reveal>

                        <Reveal direction="right">
                            <HomeProductSlides 
                                slides={product.imagens} 
                                onSlideChange={handleSlideChange}
                                setSwiperRef={setSwiperRef}
                            />
                        </Reveal>
                    </>
                )}
            </div>
        </section>
    );
});