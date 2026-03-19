import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Navigation } from 'swiper/modules'
import 'swiper/swiper-bundle.css';

export const AboutTimelineSlides = ({ slides, activeIndex, onSwiperInit, onSlideChange, prevButtonRef, nextButtonRef }) => {
    return (
        <div>
            <Swiper
                slidesPerView={1}
                modules={[EffectFade, Autoplay, Navigation]}
                effect="fade"
                fadeEffect={{
                    crossFade: true
                }}
                autoplay={{ 
                    delay: 5000, 
                    disableOnInteraction: false 
                }}
                loop={false}
                allowTouchMove={false}
                navigation={{
                    prevEl: prevButtonRef?.current,
                    nextEl: nextButtonRef?.current,
                }}
                onBeforeInit={(swiper) => {
                    if (onSwiperInit) {
                        onSwiperInit(swiper);
                    }
                }}
                onSlideChange={(swiper) => {
                    if (onSlideChange) {
                        const newIndex = swiper.realIndex || swiper.activeIndex;
                        onSlideChange(newIndex);
                    }
                }}
                initialSlide={activeIndex}
            >
                {slides.map((slide, index) => 
                    <SwiperSlide key={index}>
                        <div className="flex max-md:flex-col justify-between my-10">
                            <div className="mr-10">
                                <h2 className="text-3xl sm:text-4xl 2xl:text-[45px] font-light uppercase leading-snug mb-4">{slide.ano}</h2>
                                <div className="font-secondary font-light md:leading-relaxed md:tracking-wide md:max-w-72 text-balance mb-8 2xl:mb-10" dangerouslySetInnerHTML={{ __html: slide.descricao }} />
                            </div>
                            <img src={slide.imagem} className="md:max-w-[65%]" alt={`Timeline ${slide.ano}`} />
                        </div>
                    </SwiperSlide>
                )}
            </Swiper>
        </div>
    );
};