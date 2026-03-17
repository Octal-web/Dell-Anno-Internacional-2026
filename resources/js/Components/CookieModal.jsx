import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
};

const getCookie = (name) => {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
};

export const CookieModal = ({ acceptCookies, visible }) => {
    const [showModal, setShowModal] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [showSecondStep, setShowSecondStep] = useState(false);
    const [analyticalCookiesEnabled, setAnalyticalCookiesEnabled] = useState(true);
    const [disableCookiesLink, setDisableCookiesLink] = useState('https://support.google.com/chrome/answer/95647?hl=pt');

    useEffect(() => {
        const notifyCookies = getCookie('notify-cookies');
        const rejectCookies = getCookie('reject-cookies');
        if (notifyCookies === '1' || rejectCookies === '1') {
            setShowModal(false);
        }

        // const userAgent = navigator.userAgent.toLowerCase();

        // if (userAgent.indexOf("firefox") > -1) {
        //     setDisableCookiesLink("https://support.mozilla.org/pt-BR/kb/disable-third-party-cookies");
        // } else if (userAgent.indexOf("chrome") > -1) {
        //     setDisableCookiesLink("https://support.google.com/chrome/answer/95647?hl=pt");
        // } else if (userAgent.indexOf("safari") > -1) {
        //     setDisableCookiesLink("https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac");
        // } else if (userAgent.indexOf("edge") > -1) {
        //     setDisableCookiesLink("https://support.microsoft.com/pt-br/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09");
        // } else {
        //     setDisableCookiesLink("https://support.google.com/chrome/answer/95647?hl=pt");
        // }
    }, []);

    const handleAcceptAllCookies = () => {
        setCookie('notify-cookies', '1', 365);
        setIsFadingOut(true);
        acceptCookies();
        setTimeout(() => {
            setShowModal(false);
        }, 200);
    };

    const handleSelectCookies = () => {
        setShowSecondStep(true);
    };

    const handleAcceptSelected = () => {
        if (analyticalCookiesEnabled) {
            setCookie('notify-cookies', '1', 365);
        } else {
            setCookie('reject-cookies', '1', 365);
        }
        setIsFadingOut(true);
        acceptCookies();
        setTimeout(() => {
            setShowModal(false);
        }, 200);
    };

    const handleRejectNonEssential = () => {
        setCookie('reject-cookies', '1', 365);
        setIsFadingOut(true);
        acceptCookies();
        setTimeout(() => {
            setShowModal(false);
        }, 200);
    };

    const handleBackToFirst = () => {
        setShowSecondStep(false);
    };

    if (!showModal || !visible) {
        return null;
    }

    return (
        <div className={`fixed top-[15%] left-0 right-0 z-[197] ${isFadingOut ? 'animate-fade-out-down' : ''}`}>
            <div className="max-w-full">
                <div className={`bg-black/60 backdrop-blur-lg max-w-3xl pl-[6vw] pr-8 py-4 2xl:py-6 shadow-md mb-10${showSecondStep ? ' animate-fade-in-down' : ''}`}>
                    {!showSecondStep ? (
                        <>
                            <div className="max-w-lg">
                                <h3 className="text-2xl text-white uppercase mb-4">Cookies</h3>
                                <p className="font-secondary text-sm text-white text-justify">
                                    This website uses cookies to improve the user experience by registering the preffered language and theme.
                                </p>
                            </div>
                            <div className="flex gap-8 mt-6 justify-center max-w-lg">
                                <button
                                    onClick={handleAcceptAllCookies}
                                    className="border border-white text-white font-light text-center px-6 py-1.5 min-w-36 transition-all hover:bg-white hover:text-black hover:border-white"
                                >
                                    Accept all
                                </button>
                                
                                <button
                                    onClick={handleSelectCookies}
                                    className="text-white text-sm underline hover:opacity-80 transition-colors"
                                >
                                    Select cookies
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <h3 className="text-lg text-white font-semibold mb-2 2xl:mb-4 text-center">
                                    Que tipos de cookies utilizamos?
                                </h3>
                                <p className="text-sm text-white mb-4 2xl:mb-6">
                                    Você pode desabilitar os cookies alterando as configurações do seu navegador, mas saiba que isso pode afetar o funcionamento do site. veja como desabilitar{' '}
                                    <a href={disableCookiesLink} target="_blank" rel="noopener noreferrer" className="underline text-white">aqui</a>.
                                </p>
                                
                                <div className="space-y-2 2xl:space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="text-white font-medium">Cookies necessários</h4>
                                        </div>
                                        <div className="text-sm text-white">
                                            Sempre ativos
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="text-white font-medium">Cookies analíticos</h4>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={analyticalCookiesEnabled}
                                                    onChange={(e) => setAnalyticalCookiesEnabled(e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-neutral-800 shadow-sm peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-600 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-200"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 mt-6 2xl:mt-8">
                                    <button
                                        onClick={handleBackToFirst}
                                        className="max-sm:hidden text-white text-sm underline hover:opacity-80 transition-colors"
                                    >
                                        ← Voltar
                                    </button>
                                    <div className="flex gap-3 ml-auto">
                                        <button
                                            onClick={handleRejectNonEssential}
                                            className="text-white text-sm px-4 py-2 hover:opacity-80 transition-colors"
                                        >
                                            Rejeitar cookies não necessários
                                        </button>
                                        <button
                                            onClick={handleAcceptSelected}
                                            disabled={!analyticalCookiesEnabled}
                                            className="border border-white text-white font-light text-center px-6 py-1.5 min-w-36 transition-all enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-white disabled:opacity-50"
                                        >
                                            Accept all
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};