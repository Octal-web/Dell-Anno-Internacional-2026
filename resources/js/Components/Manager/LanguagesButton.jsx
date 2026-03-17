import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDesc } from '@fortawesome/free-solid-svg-icons';

export const LanguagesButton = ({ idioma, idiomas, id }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    console.log()

    if (idiomas) {
        return (
            <div className="relative" ref={ref}>
                <button onClick={toggleDropdown} className="flex border border-stroke bg-white px-2 py-1 rounded-sm transition-all hover:bg-slate-100 ml-2">
                    <img src={`/admin/img/flags/${idioma}.png`} className="w-6 mr-2" />
                    <FontAwesomeIcon icon={faSortDesc} className={`text-primary text-xs mt-1 ${isOpen ? `rotate-180 mt-2` : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-max p-1 bg-white border border-stroke rounded-sm shadow-lg z-[100]">
                        {idiomas.map((idiomaItem, index) => (
                            <Link
                                href={id ? route(route().current(), {id: id, lang: idiomaItem.codigo}) : route(route().current(), {lang: idiomaItem.codigo})}
                                key={index}
                                className="flex items-center p-2 hover:bg-slate-100 transition"
                            >
                                <img src={`/admin/img/flags/${idiomaItem.codigo}.png`} className="w-6 mr-2" />
                                <span className="text-sm">{idiomaItem.nome}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    }
};