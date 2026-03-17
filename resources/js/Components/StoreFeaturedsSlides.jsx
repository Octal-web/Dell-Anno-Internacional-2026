import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules'
import 'swiper/swiper-bundle.css';

export const StoreFeaturedsSlides = ({ slides }) => {
    if (!slides) return;

    return (
        <section className="pb-20">
            <div className="relative">
                <Swiper
                    slidesPerView={2}
                    centeredSlides={true}
                    modules={[Autoplay]}
                    autoplay={{ delay: 8000 }}
                    loop={true}
                    breakpoints={{
                        0: {
                            slidesPerView: 1.3,
                            centeredSlides: true,
                        },
                        768: {
                            slidesPerView: 2,
                            centeredSlides: true,
                        },
                    }}
                    className="!overflow-visible [&_.swiper-slide:not(.swiper-slide-active)_img]:scale-[0.85] md:[&_.swiper-slide:not(.swiper-slide-active)_img]:scale-[0.8]"
                >
                    {slides.map((slide, index) => 
                        <SwiperSlide key={index}>
                            <div className="">
                                <img src={slide.imagem} className="aspect-[13/9] object-cover transition-all" />
                            </div>
                        </SwiperSlide>
                    )}
                    
                    {slides.map((slide, index) => 
                        <SwiperSlide key={index}>
                            <div className="">
                                <img src={slide.imagem} className="aspect-[13/9] object-cover transition-all" />
                            </div>
                        </SwiperSlide>
                    )}
                </Swiper>
            </div>
        </section>
    );
};