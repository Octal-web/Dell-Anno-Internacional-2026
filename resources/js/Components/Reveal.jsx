import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Reveal = ({ children, direction = "bottom", delay = 0, reverse = false, scale = false, className }) => {
    const directions = {
        left: { x: -50, y: 0 },
        right: { x: 50, y: 0 },
        top: { x: 0, y: -50 },
        bottom: { x: 0, y: 50 },
        default: { x: 0, y: 30 },
    };
    
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        ScrollTrigger.refresh();

        let mm = gsap.matchMedia();
        
        mm.add("(min-width: 768px)", () => {
            const moveDirection = directions[direction] || directions.default;
            
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === element) {
                    st.kill();
                }
            });

            gsap.set(element, {
                x: moveDirection.x,
                y: moveDirection.y,
                opacity: 0,
                scale: scale ? 0.9 : 1,
                will: 'transform'
            });

            gsap.to(element, {
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power2.out',
                delay: delay * 0.1,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: reverse ? 'play none resume reverse' : 'play none none none',
                    id: `reveal-${Date.now()}`,
                    refreshPriority: -1,
                }
            });
        });

        mm.add("(max-width: 767px)", () => {
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === element) {
                    st.kill();
                }
            });

            gsap.set(element, {
                y: 30,
                opacity: 0,
                will: 'transform'
            });

            gsap.to(element, {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out',
                delay: delay * 0.08,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    id: `reveal-mobile-${Date.now()}`,
                }
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === element) {
                    st.kill();
                }
            });
            mm.revert();
        };
    }, [direction, delay, reverse]);

    useEffect(() => {
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <div ref={elementRef} className={className}>
            {children}
        </div>
    );
};