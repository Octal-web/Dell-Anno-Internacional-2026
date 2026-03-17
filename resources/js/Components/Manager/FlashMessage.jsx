import React, { useState, useEffect } from 'react';

export const FlashMessage = ({ type, message }) => {
    const [visible, setVisible] = useState(true);

    const bgByType = (type) => {
        switch (type) {
            case 'error':
                return 'bg-red-500';
            case 'warning':
                return 'bg-yellow-500';
            case 'success':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    const handleClose = () => {
        setVisible(!visible);
    };

    if (!visible) return null;

    return (
        <div className={`${bgByType(type)} text-sm text-white p-4 pr-10 mb-6 relative`} role="alert">
            {message}
            <span className="absolute top-0 bottom-0 right-0 p-4" onClick={handleClose}>
                <svg className="fill-current h-5 w-5 text-red-700" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
            </span>
        </div>
    );
};
