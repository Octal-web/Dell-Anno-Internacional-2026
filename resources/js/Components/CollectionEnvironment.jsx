import { useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

import { CollectionEnvironmentSlides } from './CollectionEnvironmentSlides';

export const CollectionEnvironment = ({ environment, slug }) => {
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [slidesSwiperRef, setSlidesSwiperRef] = useState(null);

    const useSwiperMobile = environment.projetos.length > 1;
    const useSwiperDesktop = environment.projetos.length > 4;
    const slidesPerView = environment.projetos.length < 5 ? environment.projetos.length : 5;

    const handleSlideChange = (swiper) => {
        const newIndex = swiper.realIndex || swiper.activeIndex;
        setActiveIndex(newIndex);
    };

    const handleChildSlideChange = (newIndex) => {
        setActiveIndex(newIndex);
        if (swiperRef.current) {
            swiperRef.current.slideToLoop(newIndex);
        }
    };

    const handleChildSwiperInit = (childSwiper) => {
        setSlidesSwiperRef(childSwiper);
        
        if (prevButtonRef.current && nextButtonRef.current) {
            childSwiper.params.navigation.prevEl = prevButtonRef.current;
            childSwiper.params.navigation.nextEl = nextButtonRef.current;
            childSwiper.navigation.init();
            childSwiper.navigation.update();
        }
    };
    
    const handleSlideClick = (index) => {
        setActiveIndex(index);
        if (swiperRef.current) {
            swiperRef.current.slideToLoop(index);
        }
        
        if (slidesSwiperRef) {
            slidesSwiperRef.slideToLoop(index);
        }
    };

    const renderStaticNavigation = () => (
        <div className="flex justify-center items-center gap-8 md:gap-20">
            {environment.projetos.map((projeto, index) => (
                <div
                    key={index}
                    className="text-center transition-all cursor-pointer hover:opacity-70"
                    onClick={() => handleSlideClick(index)}
                >
                    <h3 className={`relative text-xl sm:text-2xl ${activeIndex === index ? 'font-bold' : 'font-light'} uppercase leading-snug p-2 sm:p-4 whitespace-nowrap`}>
                        <span className={`absolute -bottom-4 left-1/2 w-3/4 h-2 bg-black transition-all -translate-x-1/2 ${activeIndex === index ? 'opacity-100' : 'opacity-0'} `} />
                        {environment.nome + ' #' + (index + 1)}
                    </h3>
                </div>
            ))}
        </div>
    );

    const renderSwiperNavigation = () => (
        <>
            <div className="max-w-[1350px] mx-auto">
                <Swiper
                    slidesPerView={1.8}
                    breakpoints={{
                        768: {
                            slidesPerView: Math.min(3, environment.projetos.length)
                        },
                        1024: {
                            slidesPerView: slidesPerView
                        }
                    }}
                    modules={[]}
                    loop={false}
                    centeredSlides={true}
                    onBeforeInit={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    onSlideChange={handleSlideChange}
                    initialSlide={0}
                >
                    {environment.projetos.map((projeto, index) => 
                        <SwiperSlide key={index}>
                            <div
                                className="text-center w-full mx-auto transition-all cursor-pointer hover:opacity-70"
                                onClick={() => handleSlideClick(index)}
                            >
                                <h3 className={`relative text-lg sm:text-xl md:text-2xl ${activeIndex === index ? 'font-bold' : 'font-light'} uppercase leading-snug p-2 md:p-4`}>
                                    <span className={`absolute -bottom-2 md:-bottom-4 left-1/2 w-3/4 h-1.5 md:h-2 bg-black transition-all -translate-x-1/2 ${activeIndex === index ? 'opacity-100' : 'opacity-0'} `} />
                                    {environment.nome + ' #' + (index + 1)}
                                </h3>
                            </div>
                        </SwiperSlide>
                    )}
                </Swiper>
            </div>
            
            <button
                ref={prevButtonRef}
                className="[&:not(.swiper-button-lock)]:group w-12 h-12 md:w-16 md:h-16 absolute -top-1 -left-6 md:-left-3 flex items-center justify-center bg-white z-10"
            >
                <ArrowIcon className="rotate-180 fill-none stroke-black opacity-30 transition-all group-hover:opacity-100 w-3 md:w-auto" />
            </button>

            <button
                ref={nextButtonRef}
                className="[&:not(.swiper-button-lock)]:group w-12 h-12 md:w-16 md:h-16 absolute -top-1 -right-6 md:-right-3 flex items-center justify-center bg-white z-10"
            >
                <ArrowIcon className="fill-none stroke-black opacity-30 transition-all group-hover:opacity-100 w-3 md:w-auto" />
            </button>
        </>
    );

    return (
        <section className="pt-8 md:pt-12 2xl:pt-20">
            <div className="container max-w-large">
                <div className={`border-b border-neutral-300 pb-4 sm:px-2 sm:px-4 lg:px-10 ${(useSwiperMobile || useSwiperDesktop) ? 'relative' : ''}`}>
                    {useSwiperMobile && (
                        <div className="md:hidden">
                            {renderSwiperNavigation()}
                        </div>
                    )}
                    {!useSwiperMobile && (
                        <div className="md:hidden">
                            {renderStaticNavigation()}
                        </div>
                    )}
                    
                    {useSwiperDesktop && (
                        <div className="hidden md:block">
                            {renderSwiperNavigation()}
                        </div>
                    )}
                    {!useSwiperDesktop && (
                        <div className="hidden md:block">
                            {renderStaticNavigation()}
                        </div>
                    )}
                </div>

                <p className="font-secondary font-light leading-relaxed text-center tracking-wide mt-6 md:mt-10 2xl:mt-14 md:mb-16 2xl:mb-20">{environment.descricao_curta}</p>
            </div>
            
            <CollectionEnvironmentSlides 
                slides={environment.projetos} 
                activeIndex={activeIndex} 
                onSwiperInit={handleChildSwiperInit}
                onSlideChange={handleChildSlideChange}
                prevButtonRef={prevButtonRef}
                nextButtonRef={nextButtonRef}
                slug={slug}
            />
        </section>
    );
};

const ArrowIcon = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11.013"
            height="18"
            viewBox="0 0 11.013 18"
            className={className}
        >
            <path d="M0,0,9.4,8.05,0,16.107" transform="translate(0.946 0.946)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.342"/>
        </svg>
    )
};