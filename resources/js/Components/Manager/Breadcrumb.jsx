import React from 'react';

import { Link } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LanguagesButton } from './LanguagesButton';

export const Breadcrumb = ({ icon, items, current, idioma, idiomas, id }) => {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-black"><FontAwesomeIcon icon={icon} className="mr-2" /> {current}</h2>

            <nav className="sm:ml-auto">
                <ol className="flex items-center gap-1.5">
                    {items.map((item, index) => (
                        <li key={index}>
                            <Link className="font-medium text-slate-500" href={item.params ? route(item.link, item.params) : route(item.link)}>{item.label} /</Link>
                        </li>

                    ))}
                    <li className="font-medium text-black">{current}</li>
                </ol>
            </nav>

            <LanguagesButton idioma={idioma} idiomas={idiomas} id={id} />
        </div>
    );
};
