import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Reveal } from "./Reveal";
import { FairCitySlides } from "./FairCitySlides";

export const FairItem = ({ city, isReverse }) => {
    const [willInvert, setWillInvert] = useState(() => {
        if (typeof window !== "undefined") {
            return window.innerWidth < 768 ? false : isReverse;
        }
        return isReverse;
    });

    const [currentSlide, setCurrentSlide] = useState(1);
    const [swiperRef, setSwiperRef] = useState(null);

    const totalSlides = city.imagens.length;

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
        <section className="pt-16 md:pt-20 2xl:pt-24 pb-10 2xl:pb-14">
            <div className="relative grid grid-cols-1 md:grid-cols-2 max-md:gap-y-10">
                {willInvert ? (
                    <>
                        <Reveal direction="left">
                            <FairCitySlides 
                                slides={city.imagens} 
                                onSlideChange={handleSlideChange}
                                setSwiperRef={setSwiperRef}
                            />
                        </Reveal>

                        <Reveal direction="right" className="relative max-w-[768px] max-md:px-[5%] md:pr-[10%] h-full flex items-center">  
                            <div className="absolute top-[272%] md:top-0 left-12 flex items-center mb-8 md:mx-4">
                                <div className="flex items-center text-gray-400 text-sm font-light sm:tracking-widest">
                                    <button 
                                        onClick={goToPrevSlide}
                                        className="mr-4 hover:text-gray-600 transition-colors disabled:opacity-50"
                                        disabled={currentSlide === 1}
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

                            <div className="md:ml-12">
                                <h2 className="text-3xl sm:text-4xl 2xl:text-[45px] font-light uppercase tracking-wide leading-snug mb-1 md:mb-2">{city.nome}</h2>
                                
                                <h4 className="font-secondary text-lg font-semibold mb-6 md:mb-8">{city.cidade}</h4>
                                
                                <p className="font-secondary font-light sm:tracking-wide max-w-md">{city.descricao}</p>
                            </div>
                        </Reveal>
                    </>
                ) : (
                    <>
                        <Reveal direction="left" className="w-full max-md:px-[5%] md:pl-[10%] h-full flex items-center">
                            <div className="max-w-[768px] w-full h-full flex items-center ml-auto">
                                <div className="absolute top-[272%] md:top-0 flex items-center mb-8 md:mx-4">
                                    <div className="flex items-center text-gray-400 text-sm font-light sm:tracking-widest">
                                        <button 
                                            onClick={goToPrevSlide}
                                            className="mr-4 hover:text-gray-600 transition-colors disabled:opacity-50"
                                            disabled={currentSlide === 1}
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
                                        >
                                            <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2 16L9 9L2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="md:mr-12">
                                    <h2 className="text-3xl sm:text-4xl 2xl:text-[45px] font-light uppercase tracking-wide leading-snug mb-1 md:mb-2">{city.nome}</h2>
                                    
                                    <h4 className="font-secondary text-lg font-semibold mb-6 md:mb-8">{city.cidade}</h4>
                                    
                                    <p className="font-secondary font-light sm:tracking-wide max-w-md">{city.descricao}</p>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal direction="right">
                            <FairCitySlides 
                                slides={city.imagens} 
                                onSlideChange={handleSlideChange}
                                setSwiperRef={setSwiperRef}
                            />
                        </Reveal>
                    </>
                )}
            </div>
        </section>
    );
};