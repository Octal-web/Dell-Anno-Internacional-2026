import { useState, useRef, useEffect } from "react";

import { HomeProductsList } from "./HomeProductsList";
import { HomeProductItem } from "./HomeProductItem";

export const HomeProducts = ({ content, products }) => {
    const [current, setCurrent] = useState(null);
    const itemRefs = useRef([]);

    useEffect(() => {
        if (current) {
            const productIndex = products.findIndex(p => p.nome === current.nome);

            const itemElement = itemRefs.current[productIndex];

            if (itemElement) {
                itemElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [current, products]);

    return (
        <>
            <HomeProductsList content={content} products={products} current={current} setCurrent={setCurrent} />

            {products.map((product, index) => (
                <HomeProductItem key={index} product={product} index={index} current={current} isReverse={index % 2 !== 0} ref={el => itemRefs.current[index] = el} /> 
            ))}
        </>
    );
};