import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LetterReveal = ({ text, className, element = "div" }) => {
    const containerRef = useRef(null);
    const letterRefs = useRef([]);

    useEffect(() => {
        if (!letterRefs.current.length) return;

        gsap.fromTo(
            letterRefs.current,
            { opacity: 0, x: 20, rotate: -5 },
            {
                opacity: 1,
                x: 0,
                rotate: 0,
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.02,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                },
            },
        );
    }, []);

    letterRefs.current = [];

    const Tag = element;

    return (
        <Tag ref={containerRef} className={className} style={{ overflow: "hidden" }}>
            {text.split(" ").map((word, wi) => (
                <span
                    key={wi}
                    style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: "0.25em" }}
                >
                    {word.split("").map((char, ci) => (
                        <span
                            key={ci}
                            ref={(el) => el && letterRefs.current.push(el)}
                            style={{ display: "inline-block" }}
                        >
                            {char}
                        </span>
                    ))}
                </span>
            ))}
        </Tag>
    );
};

export default LetterReveal;