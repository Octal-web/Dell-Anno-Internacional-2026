import { useEffect, useState, useRef } from "react";
import { Link } from "@inertiajs/react";

import { ProductsSubmenu } from './ProductsSubmenu';

export const MenuItem = ({ item, isHeaderVisible, index, isMenuOpen }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const toggleRef = useRef(null);

    const toggleSubmenu = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                toggleRef.current &&
                !toggleRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const mobileAnimationStyle = {
        '@media (max-width: 768px)': {
            opacity: isMenuOpen ? 1 : 0,
            transform: isMenuOpen ? 'translateY(0)' : 'translateY(-20px)',
            transition: `opacity 0.4s ease-out ${index * 0.1}s, transform 0.4s ease-out ${index * 0.1}s`
        }
    };

    return (
        <li 
            className="max-md:opacity-0 max-md:translate-y-[-20px]"
            style={window.innerWidth < 768 ? {
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? 'translateY(0)' : 'translateY(-20px)',
                transition: `opacity 0.4s ease-out ${index * 0.1}s, transform 0.4s ease-out ${index * 0.1}s`
            } : {}}
        >
            {item.external ? (
                <a
                    href={item.route}
                    className="relative block font-secondary font-light text-white md:text-black text-[17px] transition-all text-opacity-0 md:p-2 !text-opacity-0 after:content-[attr(data-after)] after:text-black after:leading-none hover:after:text-opacity-100 after:text-[17px] hover:after:font-bold after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white md:after:text-black after:whitespace-nowrap after:transition-all duration-300 after:duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-after={item.name}
                >
                    {item.name}
                </a>
            ) : Array.isArray(item.submenu) && item.submenu.length > 0 ? (
                <button
                    ref={toggleRef}
                    onClick={toggleSubmenu}
                    className="relative block font-secondary font-light text-white md:text-black text-[17px] transition-all text-opacity-0 md:p-2 !text-opacity-0 after:content-[attr(data-after)] after:text-black after:leading-none hover:after:text-opacity-100 after:text-[17px] hover:after:font-bold after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white md:after:text-black after:whitespace-nowrap after:transition-all duration-300 after:duration-300"
                    data-after={item.name}
                >
                    {item.name}
                    <span className="ml-2 text-base">{isOpen ? "▲" : "▼"}</span>
                </button>
            ) : typeof item.submenu === "string" && item.submenu === "Produtos" ? (
                <button
                    ref={toggleRef}
                    onClick={toggleSubmenu}
                    className="relative block font-secondary font-light text-white md:text-black text-[17px] transition-all text-opacity-0 md:p-2 !text-opacity-0 after:content-[attr(data-after)] after:text-black after:leading-none hover:after:text-opacity-100 after:text-[17px] hover:after:font-bold after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white md:after:text-black after:whitespace-nowrap after:transition-all duration-300 after:duration-300"
                    data-after={item.name}
                >
                    {item.name}
                </button>
            ) : (
                <Link
                    href={route(item.route)}
                    to={item.to}
                    className="relative block font-secondary font-light text-white md:text-black text-[17px] transition-all text-opacity-0 md:p-2 !text-opacity-0 after:content-[attr(data-after)] after:text-black after:leading-none hover:after:text-opacity-100 after:text-[17px] hover:after:font-bold after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white md:after:text-black after:whitespace-nowrap after:transition-all duration-300 after:duration-300"
                    data-after={item.name}
                >
                    {item.name}
                </Link>
            )}

            {item.submenu && (
                typeof item.submenu === "string" && item.submenu === "Produtos" ? (
                    <ProductsSubmenu menuRef={menuRef} isMenuOpen={isOpen} isHeaderVisible={isHeaderVisible} />
                ) : Array.isArray(item.submenu) && item.submenu.length > 0 ? (
                    <ul
                        ref={menuRef}
                        className={`absolute left-0 mt-2 w-48 bg-white shadow-lg overflow-hidden transition-all z-[1] ${
                            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                        {item.submenu.map((subItem, index) => (
                            <li key={index} className="border-b border-gray-200 last:border-0">
                                <Link
                                    href={`${route(item.route)}#${subItem.slug}`} 
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    {subItem.nome ?? subItem.slug}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : null
            )}
        </li>
    );
};