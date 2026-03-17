import React from 'react';

export const InputCheckbox = ({ title, name, checked, onChange }) => {
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        onChange(name, checked);
    };

    return (
        <div className="flex gap-x-8 mb-6">
            <div className="w-full">
                <div className="mb-2">
                    <label className="block font-bold text-gray-500">{title}</label>
                </div>
                <div className="flex items-center mt-5">
                    <input 
                        type="checkbox" 
                        id={name} 
                        name={name} 
                        className="h-4 w-4 text-primary focus:ring-0" 
                        checked={checked} 
                        onChange={handleCheckboxChange} 
                    />
                    <label htmlFor="nova_aba" className="ml-2 block text-sm sm:text-base text-black">Sim</label>
                </div>
            </div>
        </div>
    );
};
