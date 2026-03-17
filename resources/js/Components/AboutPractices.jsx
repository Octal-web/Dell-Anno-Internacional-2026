import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const AboutPractices = ({ content }) => {
    const [tableData, setTableData] = useState(null);
    const [otherContent, setOtherContent] = useState(null);
    const containerRef = useRef(null);
    const cardRefs = useRef([]);

    useEffect(() => {
        if (!content?.texto) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(content.texto, 'text/html');

        const table = doc.querySelector('table');
        if (table) {
            // Extrai dados da tabela
            const rows = table.querySelectorAll('tbody tr');
            const data = Array.from(rows).map(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    const img = cells[0].querySelector('img');
                    const html = cells[1].innerHTML.trim();
                    return {
                        image: img ? img.src : null,
                        html: html
                    };
                }
                return null;
            }).filter(Boolean);

            setTableData(data);

            table.remove();
        }

        setOtherContent(doc.body.innerHTML);

    }, [content.texto]);

    useEffect(() => {
        if (tableData && cardRefs.current.length > 0) {
            setTimeout(() => {
                gsap.fromTo(
                    cardRefs.current,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power2.out",
                        stagger: 0.1,
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }, 100);
        }
    }, [tableData]);

    if (!tableData) {
        return (
            <section className="pt-16 sm:pt-20 md:pt-24 2xl:pt-32">
                <div className="container max-w-large">
                    <div 
                        className="font-light sm:leading-loose text-center sm:tracking-wide max-w-[1280px] mx-auto mb-12"
                        dangerouslySetInnerHTML={{ __html: content.texto }} 
                    />
                </div>
            </section>
        );
    }

    return (
        <section className="pt-28 2xl:pt-32 pb-16">
            <div className="container max-w-large" ref={containerRef}>
                
                {otherContent && (
                    <div
                        className="font-light sm:leading-loose text-center sm:tracking-wide max-w-[1280px] mx-auto mb-12"
                        dangerouslySetInnerHTML={{ __html: otherContent }}
                    />
                )}

                {tableData && (
                    <div className="border-t border-b border-neutral-300">
                        <Swiper
                            slidesPerView={2.5}
                            spaceBetween={16}
                            loop={false}
                            breakpoints={{
                                768: {
                                    slidesPerView: 5,
                                    spaceBetween: 20,
                                },
                                1280: {
                                    slidesPerView: 6,
                                    spaceBetween: 24,
                                }
                            }}
                        >
                            {tableData.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <div
                                        ref={el => cardRefs.current[index] = el}
                                        className="transition-all duration-300 py-12 h-full"
                                    >
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className="w-24 h-24 flex items-center justify-center">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt="Practice icon"
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <div className="w-6 h-6 bg-black rounded"></div>
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                className="font-light max-sm:tracking-tight md:leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: item.html }}
                                            />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
        </section>
    );
};
