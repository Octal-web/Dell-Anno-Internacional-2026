import { useRef, useEffect, useState } from 'react';

import { Link } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export const MenuItem = ({ id, label, icon, href, subMenu, isOpen, onToggle, controller, controllers = [] }) => {
    const submenuRef = useRef(null);

    if (subMenu) {
        return (
            <li>
                <button
                    aria-current="false"
                    className="group relative flex items-center w-full px-5 py-4 font-medium text-sm text-black duration-300 ease-in-out hover:bg-neutral-100"
                    onClick={() => onToggle(id)}
                >
                    <FontAwesomeIcon icon={icon} className="text-lg mr-5 w-6" /> {label}
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                    {controllers.includes(controller) && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 my-3 bg-black"></div>
                    )}
                </button>
                <div
                    ref={submenuRef}
                    className={`submenu overflow-hidden transition-max-height duration-300 ease-in-out ${isOpen ? 'max-h-40' : 'max-h-0'}`}
                >
                    <ul>
                        {subMenu.map((subItem, index) => (
                            <li key={index}>
                                <Link
                                    aria-current="page"
                                    className="relative pl-16 pr-2 py-3 block font-medium text-sm text-black duration-300 ease-in-out bg-neutral-100 hover:bg-neutral-200"
                                    href={subItem.href}
                                >
                                    {subItem.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </li>
        );
    } else {
        return (
            <li>
                <Link
                    href={href}
                    aria-current="page"
                    className="group relative flex items-center px-5 py-4 font-medium text-sm text-black duration-300 ease-in-out hover:bg-neutral-100"
                >
                    <FontAwesomeIcon icon={icon} className="text-lg mr-5 w-6" /> {label}
                    {controllers.includes(controller) && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 my-3 bg-black"></div>
                    )}
                </Link>
            </li>
        );
    }
};
