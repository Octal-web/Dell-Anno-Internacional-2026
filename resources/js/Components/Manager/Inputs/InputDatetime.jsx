import React from 'react';

export const InputDatetime = ({ title, name, value, idioma, onChange, max }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(name, value);
    };

    return (
        <div className="mb-6">
            <div className="flex items-center mb-2">
                <img src={`/admin/img/flags/${idioma}.png`} className="w-5 mr-1" alt={`${idioma} flag`} />
                <label className="block font-bold text-gray-500">{title}</label>
            </div>
            <input
                type="datetime-local"
                name={name}
                value={value}
                className="w-full border-gray-300 bg-transparent p-3 font-normal text-sm text-black outline-none transition focus:border-primary focus:ring-0 active:border-primary disabled:cursor-default disabled:bg-whiter"
                onChange={handleChange}
                max={max || undefined}
            />
        </div>
    );
};
