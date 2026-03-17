import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const StoreHorizontalLoop = ({ images, direction = 'right', onImageClick }) => {
    const gallery = Array(2).fill().map(() => [...images]);

    useEffect(() => {
        const loop = horizontalLoop(`.gallery-${direction}`, {
            speed: 0.03,
            repeat: -1,
        });

        gsap.to(loop, {timeScale: direction === 'right' ? 1 : -1, overwrite: true});

        const setDirection = (value) => {
            if (loop.direction !== value) {
                gsap.to(loop, {timeScale: direction === 'right' ? value : value * -1, overwrite: true});
                loop.direction = value;
            }
        };

        const handleScroll = (e) => {
            if (e.deltaY > 0) {
                setDirection(1);
            } else {
                setDirection(-1);
            }
        };

        window.addEventListener("wheel", handleScroll);

        return () => {
            window.removeEventListener("wheel", handleScroll);
        };
    }, [direction]);

    function horizontalLoop(items, config) {
        items = gsap.utils.toArray(items);
        config = config || {};
        let tl = gsap.timeline({
            repeat: config.repeat,
            paused: config.paused,
            defaults: {
                ease: "none"
            },
            onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
        });
        let length = items.length;
        let startX = items[0].offsetLeft;
        let times = [],
            widths = [],
            xPercents = [],
            curIndex = 0,
            pixelsPerSecond = (config.speed || 1) * 100,
            snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1),
            totalWidth,
            curX,
            distanceToStart,
            distanceToLoop,
            item,
            i;

        gsap.set(items, {
            xPercent: (i, el) => {
                let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
                xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
                return xPercents[i];
            },
        });

        gsap.set(items, {
            x: 0
        });
        totalWidth =
            items[length - 1].offsetLeft +
            (xPercents[length - 1] / 100) * widths[length - 1] -
            startX +
            items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") +
            (parseFloat(config.paddingRight) || 0);

        for (i = 0; i < length; i++) {
            item = items[i];
            curX = (xPercents[i] / 100) * widths[i];
            distanceToStart = item.offsetLeft + curX - startX;
            distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
            tl.to(
                    item, {
                        xPercent: snap((curX - distanceToLoop) / widths[i] * 100),
                        duration: distanceToLoop / pixelsPerSecond
                    },
                    0
                )
                .fromTo(
                    item, {
                        xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)
                    }, {
                        xPercent: xPercents[i],
                        duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
                        immediateRender: false,
                    },
                    distanceToLoop / pixelsPerSecond
                )
                .add("label" + i, distanceToStart / pixelsPerSecond);
            times[i] = distanceToStart / pixelsPerSecond;
        }

        function toIndex(index, vars) {
            vars = vars || {};
            Math.abs(index - curIndex) > length / 2 && (index += index > curIndex ? -length : length);
            let newIndex = gsap.utils.wrap(0, length, index),
                time = times[newIndex];
            if (time > tl.time() !== index > curIndex) {
                vars.modifiers = {
                    time: gsap.utils.wrap(0, tl.duration())
                };
                time += tl.duration() * (index > curIndex ? 1 : -1);
            }
            curIndex = newIndex;
            vars.overwrite = true;
            return tl.tweenTo(time, vars);
        }

        tl.next = (vars) => toIndex(curIndex + 1, vars);
        tl.previous = (vars) => toIndex(curIndex - 1, vars);
        tl.current = () => curIndex;
        tl.toIndex = (index, vars) => toIndex(index, vars);
        tl.times = times;
        tl.progress(1, true).progress(0, true);
        if (config.reversed) {
            tl.vars.onReverseComplete();
            tl.reverse();
        }

        return tl;
    }
    
    const handleImageClick = (imageIndex) => {
        if (onImageClick) {
            onImageClick(imageIndex);
        }
    };

    return (
        <div className="overflow-hidden relative">
            <div className="flex w-max">
                {gallery.map((item, index) => (
                    <div key={index} className={`gallery-${direction} flex whitespace-nowrap`}>
                        {item.map((image, subIndex) => (
                            <div className="mx-2 md:mx-3 2xl:mx-6 group overflow-hidden cursor-pointer relative" key={subIndex} onClick={() => handleImageClick(subIndex)}>
                                <img
                                    src={image.imagem}
                                    alt={`Slide ${index + 1}`}
                                    className="h-[150px] md:h-[200px] lg:h-[350px] 2xl:h-[470px] object-cover"
                                />

                                <div className="absolute inset-0 bg-black opacity-0 transition-all duration-300 group-hover:opacity-50" />
                                
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 z-10">
                                    <div className="bg-white bg-opacity-80 rounded-full p-3 shadow-lg">
                                        <svg 
                                            className="w-6 h-6 text-gray-700" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={1} 
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" 
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};