import { Link } from "@inertiajs/react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";

export const CollectionEnvironmentSlides = ({ 
    slides, 
    activeIndex, 
    onSwiperInit, 
    onSlideChange, 
    prevButtonRef, 
    nextButtonRef,
    slug
}) => {
    return (
        <div className="w-full">
            <Swiper
                slidesPerView={1.4}
                modules={[Autoplay, Navigation]}
                loop={true}
                centeredSlides={slides.length > 2}
                allowTouchMove={false}
                spaceBetween={50}
                navigation={{
                    prevEl: prevButtonRef?.current,
                    nextEl: nextButtonRef?.current,
                }}
                breakpoints={{
                    0: {
                        spaceBetween: 20
                    },
                    768: {
                        spaceBetween: 40
                    },
                    1024: {
                        spaceBetween: 50
                    }
                }}
                onBeforeInit={(swiper) => {
                    if (onSwiperInit) {
                        onSwiperInit(swiper);
                    }
                }}
                onSlideChange={(swiper) => {
                    if (onSlideChange) {
                        const newIndex = swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex;
                        onSlideChange(newIndex);
                    }
                }}
                initialSlide={activeIndex}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <Link href={route('Produtos.projeto', {slug: slug, projeto: slide.slug})} className="relative block mt-8 md:mt-10 2xl:my-10 overflow-hidden group">
                            <img src={slide.imagem} className="w-full max-md:aspect-[3/2] object-cover" alt={`Slide ${index + 1}`} />

                            <div className="hidden md:block absolute inset-0 bg-black opacity-0 transition-all group-hover:opacity-20" />
                            
                            <div className="hidden md:block w-fit absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 border border-white font-light text-center uppercase py-1 md:py-2 px-8 md:min-w-40 sm:min-w-44 opacity-0 transition-all group-hover:opacity-100 group-hover:top-1/2 group/button mix-blend-screen hover:mix-blend-normal">

                                <div className="absolute inset-0 right-auto w-full bg-white transition-all group-hover/button:w-0" /> 
                                <span className="relative transition-all group-hover/button:text-white max-sm:text-sm">See more</span>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
                
                {slides.map((slide, index) => (
                    <SwiperSlide key={index + 100}>
                        <Link href={route('Produtos.projeto', {slug: slug, projeto: slide.slug})} className="relative block mt-8 md:mt-10 2xl:my-10 overflow-hidden group">
                            <img src={slide.imagem} className="w-full max-md:aspect-[3/2] object-cover" alt={`Slide ${index + 1}`} />
                            
                            <div className="hidden md:block absolute inset-0 bg-black opacity-0 transition-all group-hover:opacity-20" />
                            
                            <div className="hidden md:block w-fit absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 border border-white font-light text-center uppercase py-1 md:py-2 px-8 md:min-w-40 sm:min-w-44 opacity-0 transition-all group-hover:opacity-100 group-hover:top-1/2 group/button mix-blend-screen hover:mix-blend-normal">

                                <div className="absolute inset-0 right-auto w-full bg-white transition-all group-hover/button:w-0" /> 
                                <span className="relative transition-all group-hover/button:text-white">See more</span>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};