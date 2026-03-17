import React, { useEffect, useRef  } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faExclamation, faInfo } from '@fortawesome/free-solid-svg-icons';

export const NotificationMessage = ({ type, message, show, onClose }) => {
    const progressRef = useRef(null);
    const notificationRef = useRef(null);

    useEffect(() => {
        if (show) {
            if (progressRef.current) {
                setTimeout(() => {
                    progressRef.current.classList.add('w-[0%]');
                    progressRef.current.classList.remove('w-full');
                }, 10);
            }

            const timeout = setTimeout(() => {
                if (notificationRef.current) {
                    notificationRef.current.classList.add('delay-75', 'opacity-0');
                }

                setTimeout(() => {
                    onClose();
                }, 300);
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [show, onClose]);

    if (!show) return null;

    const typeStyles = {
        success: {
            icon: <FontAwesomeIcon icon={faCheck} className="text-green-300" />,
            bgColor: 'bg-green-500',
            progressBarColor: 'bg-green-300',
        },
        error: {
            icon: <FontAwesomeIcon icon={faTimes} className="text-red-300" />,
            bgColor: 'bg-red-500',
            progressBarColor: 'bg-red-300',
        },
        alert: {
            icon: <FontAwesomeIcon icon={faExclamation} className="text-yellow-300" />,
            bgColor: 'bg-yellow-500',
            progressBarColor: 'bg-yellow-300',
        },
        info: {
            icon: <FontAwesomeIcon icon={faInfo} className="text-blue-300" />,
            bgColor: 'bg-blue-500',
            progressBarColor: 'bg-blue-300',
        },
    };

    const { icon, bgColor, progressBarColor } = typeStyles[type] || typeStyles['info'];

    return (
        <div
            ref={notificationRef} 
            className="fixed top-4 right-4 w-80 bg-white text-gray-800 shadow-lg flex items-center overflow-hidden transition-all duration-[0.3s] z-[100]"
        >
            <div className={`w-full max-w-12 h-14 flex items-center justify-center ${bgColor}`}>
                {icon}
            </div>

            <div className="flex-grow text-sm px-4 py-2">
                <p>{message}</p>
            </div>

            <button
                onClick={onClose}
                className="p-2 text-gray-500 -mt-1 hover:text-gray-700"
            >
                &times;
            </button>

            <div
                ref={progressRef}
                className="absolute bottom-0 left-12 w-full h-[1px] w-full transition-all duration-[5s] ease-linear bg-black"
            ></div>
        </div>
    );
};
