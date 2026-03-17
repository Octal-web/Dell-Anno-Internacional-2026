import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

export const HomeProductSlides = ({ slides, onSlideChange, setSwiperRef }) => {
    return (
        <Swiper
            onSwiper={setSwiperRef}
            slidesPerView={1}
            onSlideChange={onSlideChange}
            effect="fade"
            modules={[EffectFade]}
            fadeEffect={{ crossFade: true }}
        >
            {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                    <div className="aspect-[16/13]">
                        <img
                            src={slide.imagem}
                            className="w-full h-full object-cover"
                            alt={`Slide ${index + 1}`}
                        />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};