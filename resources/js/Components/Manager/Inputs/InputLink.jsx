import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

export const InputLink = ({ title, name, value, idioma, onChange, onCheck, max, novaAba }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(name, value);
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        onCheck(name, checked);
    };

    return (
        <div className="flex gap-x-8 mb-6">
            <div className="w-full">
                <div className="mb-2">
                    <label className="block font-bold text-gray-500">{title}</label>
                </div>
                <div className="flex">
                    <FontAwesomeIcon icon={faLink} className="px-3 py-4 h-100 bg-gray-200" />
                    <input
                        type="text"
                        name={name}
                        value={value}
                        className="w-full border-gray-300 bg-transparent p-3 font-normal text-sm text-black outline-none transition focus:border-black focus:ring-0 active:border-black disabled:cursor-default disabled:bg-whiter"
                        onChange={handleChange}
                        maxLength={max ? max : null}
                    />
                </div>
            </div>

            {novaAba !== undefined &&
                <div className="w-3/5">
                    <div className="mb-2">
                        <label className="block font-bold text-gray-500">Abrir link em nova aba?</label>
                    </div>
                    <div className="flex items-center mt-5">
                        <input 
                            type="checkbox" 
                            id="nova_aba" 
                            name="nova_aba" 
                            className="h-4 w-4 text-secondary focus:ring-0" 
                            checked={novaAba} 
                            onChange={handleCheckboxChange} 
                        />
                        <label htmlFor="nova_aba" className="ml-2 block text-sm sm:text-base text-secondary">Sim</label>
                    </div>
                </div>
            }
        </div>
    );
};
