import { useState, useRef, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";

export const ProductsSubmenu = ({ isMenuOpen, isHeaderVisible, menuRef }) => {
    const { produtosMenu } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [height, setHeight] = useState(0);
    const containerRef = useRef(null);

    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

    useEffect(() => {
        if (isMobile && isMenuOpen) {
            router.visit(route("Produtos.index"));
            return;
        }

        if (isMenuOpen) {
            setVisible(true);
            requestAnimationFrame(() => {
                if (containerRef.current) {
                    setHeight(containerRef.current.scrollHeight);
                }
            });
        } else {
            setHeight(0);
            const timeout = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [isMenuOpen, produtosMenu.length]);

    useEffect(() => {
        if (isMenuOpen) {
            setVisible(true);
            requestAnimationFrame(() => {
            if (containerRef.current) {
                setHeight(containerRef.current.scrollHeight);
            }
            });
        } else {
            setHeight(0);
            const timeout = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [isMenuOpen]);

    if (!visible && !isMenuOpen) return null;

    return (
        <div
            ref={menuRef}
            className={`hidden md:block fixed right-1/2 translate-x-1/2 top-[102px] 2xl:top-[117px] w-full bg-white overflow-hidden transition-[height,transform] duration-300 ${isHeaderVisible ? 'shadow-md' : ' -translate-y-full'}`}
            style={{ height: `${height}px` }}
        >
            <div ref={containerRef} className="container max-w-x-large pt-10 pb-16">
                <div className="grid grid-cols-2 gap-x-20 gap-y-10 justify-between max-w-[1600px]">
                    {produtosMenu.map((produto, index) => (
                        <Link
                            key={index}
                            href={route("Produtos.produto", { slug: produto.slug })}
                            className="font-secondary font-light text-black tracking-wide border-b py-2 transition-all hover:text-opacity-70"
                        >
                            {produto.nome}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
