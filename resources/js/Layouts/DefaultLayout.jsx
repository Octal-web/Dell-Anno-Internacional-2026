import React, { useState, useEffect, useRef } from 'react';
import { usePage, Link, Head } from '@inertiajs/react';

import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';

import { CookieModal } from '@/Components/CookieModal';
import { MenuItem } from '@/Components/MenuItem';

const DefaultLayout = ({ children }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isAtTop, setIsAtTop] = useState(true); 
    const [lastScrollY, setLastScrollY] = useState(0);
    const { controller, action, pagina, notifyCookie, rejectCookie } = usePage().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [trackingEnabled, setTrackingEnabled] = useState(false);
    const lenisRef = useRef(null);

    useEffect(() => {
        lenisRef.current = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
            smoothTouch: false,
        });

        function raf(time) {
            lenisRef.current.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenisRef.current.destroy();
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            setIsAtTop(currentScrollY <= 20);
            
            if (!isMenuOpen) {
                if (currentScrollY > 200) {
                    setIsVisible(currentScrollY < lastScrollY);
                } else {
                    setIsVisible(true);
                }
            }
            
            setLastScrollY(currentScrollY);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY, isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const acceptCookies = () => {
        setTrackingEnabled(true);
    };

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         if (notifyCookie || trackingEnabled) {
    //             const script = document.createElement('script');
    //             script.innerHTML = `
    //                 (function(w,d,s,l,i){
    //                     w[l]=w[l]||[];
    //                     w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
    //                     var f=d.getElementsByTagName(s)[0],
    //                         j=d.createElement(s),
    //                         dl=l!='dataLayer'?'&l='+l:'';
    //                     j.async=true;
    //                     j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    //                     f.parentNode.insertBefore(j,f);
    //                 })(window,document,'script','dataLayer','${dados_site.tag_google}');
    //             `;
    //             document.head.appendChild(script);

    //             const noscript = document.createElement('noscript');
    //             noscript.innerHTML = `
    //                 <iframe src="https://www.googletagmanager.com/ns.html?id=${dados_site.tag_google}" height="0" width="0" style="display:none;visibility:hidden"></iframe>
    //             `;
    //             document.body.appendChild(noscript);
    //         }
    //     }, 100);
    // }, [notifyCookie, trackingEnabled]);

    const menuItems = [
        { name: "Brand", route: "Institucional.index", external: false },
        { name: "Products", route: "Produtos.index", external: false, submenu: 'Produtos' },
        { name: "Stores", route: "Lojas.index", external: false },
        { name: "Global Living", route: "https://dellanno.com/global-living/", external: true },
        { name: "Get Inspired", route: "Inspiracao.index", external: false },
        { name: "Frame", route: "Blog.index", external: false },
        // { name: "Contacts", route: "Contato.index", external: false },
        { name: "Catalogs", route: "Catalogos.index", external: false },
    ];

    return (
        <>
            <Head>
                <title>{pagina.titulo}</title>
                <meta name="description" content={pagina.descricao} />

                <meta name="twitter:card" content="summary"/>

                <meta property="og:url" content={window.location.pathname} />
                <meta property="og:type" content="website"/>
                <meta property="og:title" content={pagina.tituloCompartilhamento} />
                <meta property="og:description" content={pagina.descricaoCompartilhamento} />
                <meta property="og:image" content={pagina.imagem.endereco} />
                <meta property="og:image:type" content={pagina.imagem.tipo} />
                <meta property="og:image:width" content={pagina.imagem.largura} />
                <meta property="og:image:height" content={pagina.imagem.altura} />

                <meta name="robots" content="index, follow"/>
                <meta name="author" content="Octal Web" />

                <link rel="icon" href={`/favicon.ico`} type="image/x-icon" />
            </Head>
            <header className={`header fixed top-0 left-0 right-0 bg-white z-[20] transition-all duration-300 ease-in-out ${isVisible ? 'translate-y-0 shadow-2xl shadow-black/10' : '-translate-y-full'}`}>
                <div className={`fixed inset-0 bg-black md:hidden duration-300 ease-out ${isMenuOpen ? 'opacity-30' : 'opacity-0 h-0'}`} onClick={() => {setIsMenuOpen(false)}}></div>
                <div className="container max-w-x-large">
                    <div className="flex items-center justify-between">
                        <div className="relative z-[1] flex items-center justify-between w-full my-5 md:my-7 2xl:my-8">
                            <h1 className="flex items-center">
                                <Link href={route('Home.index')} className="flex items-center">
                                    <img src={`/site/img/logo.svg`} alt="Logo" className="block max-w-30 md:max-w-50 lg:max-w-80" />
                                </Link>
                            </h1>

                            <button className={`fixed top-0 left-0 w-screen h-screen md:hidden bg-black transition-all  ${isMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`} aria-label="Close Menu" onClick={() => setIsMenuOpen(false)} />

                            <div className={`fixed md:relative bg-black bg-opacity-70 max-md:backdrop-blur-sm md:bg-transparent left-0 ${!isMenuOpen ? '-top-1 max-md:-translate-y-full' : 'top-0'} md:left-auto md:top-auto flex flex-col md:flex-row md:items-center justify-center md:justify-end w-full h-[calc(100vh_/6_*_5)] md:h-auto md:my-0.5 2xl:my-1.5 transition-all ease-out duration-500`}>
                                <nav className="relative">
                                    <img src={`/site/img/logo-white.svg`} alt="Logo" className="block max-w-50 lg:max-w-80 md:hidden mx-auto mb-20 -mt-16" />

                                    <ul className="flex flex-col md:flex-row items-center md:justify-center gap-6 md:gap-2 xl:gap-10 relative lg:mr-5 2xl:mr-0">
                                        {menuItems.map((item, index) => (
                                            <MenuItem 
                                                key={index} 
                                                item={item} 
                                                index={index}
                                                isHeaderVisible={isVisible}
                                                isMenuOpen={isMenuOpen}
                                            />
                                        ))}

                                        <li
                                            className="max-md:opacity-0 max-md:translate-y-[-20px]"
                                            style={typeof window !== 'undefined' && window.innerWidth < 768 ? {
                                                opacity: isMenuOpen ? 1 : 0,
                                                transform: isMenuOpen ? 'translateY(0)' : 'translateY(-20px)',
                                                transition: `opacity 0.4s ease-out ${menuItems.length * 0.1}s, transform 0.4s ease-out ${menuItems.length * 0.1}s`
                                            } : {}}
                                        >
                                            {/* <Link href={route('Orcamentos.index')} className="lg:mx-4 border border-neutral-800 bg-white font-light text-center px-3 py-1.5 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white" >Design Consultation</Link> */}

                                            <a href="https://tradeprogramdellanno.com/" target="_blank" rel="noopener noreferrer" className="lg:mx-4 border border-neutral-800 bg-white font-light text-center px-3 py-1.5 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white uppercase">Trade Program</a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>

                            <button className="md:hidden relative z-[2]" onClick={toggleMenu} aria-label="Toggle Menu">
                                <div className="flex items-center">
                                    <div className="relative w-7 h-[21px]">
                                        <div
                                            className={`absolute top-0 bg-black h-[2px] w-7 transition-all duration-300 ${isMenuOpen ? 'rotate-45 !top-[10px] bg-white' : 'bg-black'}`}
                                            style={{
                                                transitionDelay: isMenuOpen ? '0ms, 400ms' : '0ms',
                                                transitionProperty: 'top, transform'
                                            }}
                                        ></div>
                                        <div
                                            className={`absolute top-[9px] h-[2px] w-7 transition-all duration-300 ${isMenuOpen ? 'scale-x-0 !top-[10px] bg-white' : 'bg-black'}`}
                                            style={{
                                                transitionDelay: isMenuOpen ? '0ms, 400ms' : '0ms',
                                                transitionProperty: 'top, transform'
                                            }}
                                        ></div>
                                        <div
                                            className={`absolute bottom-0 bg-black h-[2px] w-7 transition-all duration-300 ${isMenuOpen ? '-rotate-45 bottom-[9px] bg-white' : 'bg-black'}`}
                                            style={{
                                                transitionDelay: isMenuOpen ? '0ms, 400ms' : '0ms',
                                                transitionProperty: 'bottom, transform'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="overflow-hidden pt-[72px] md:pt-[102px] 2xl:pt-[118px]">
                {children}
            </main>

            <footer className="relative bg-black">
                <div className="pt-8">
                    <div className="container max-w-x-large">
                        <div className="mb-1 py-8 flex max-md:flex-col gap-10 md:gap-20 md:items-end border-b border-b-white border-opacity-30">
                            <img src={`/site/img/logo-white.svg`} alt="Logo" className="opacity-60 max-md:max-w-30" />

                            <nav className="">
                                <ul className="flex max-lg:flex-wrap justify-evenly gap-y-4 gap-x-6 sm:gap-x-4 md:gap-x-14 lg:gap-10">
                                    <li>
                                        <Link href={route('Institucional.index')} className="block font-secondary text-white text-sm font-light leading-none transition-all opacity-70 hover:opacity-100">Brand</Link>
                                    </li>

                                    <li>
                                        <Link href={route('Produtos.index')} className="block font-secondary text-white text-sm font-light leading-none transition-all opacity-70 hover:opacity-100">Products</Link>
                                    </li>

                                    <li>
                                        <Link href={route('Lojas.index')} className="block font-secondary text-white text-sm font-light leading-none transition-all opacity-70 hover:opacity-100">Stores</Link>
                                    </li>

                                    <li>
                                        <a href="https://dellanno.com/global-living/" target="_blank" rel="noopener noreferrer" className="block font-secondary text-white text-sm font-light leading-none transition-all opacity-70 hover:opacity-100">Global Living</a>
                                    </li>

                                    <li>
                                        <Link href={route('Inspiracao.index')} className="block font-secondary text-white text-sm font-light leading-none transition-all opacity-70 hover:opacity-100">Get Inspired</Link>
                                    </li>

                                    <li>
                                        <Link href={route('Contato.index')} className="block font-secondary text-white text-sm font-light leading-none transition-all opacity-70 hover:opacity-100">Contacts</Link>
                                    </li>
                                </ul>
                            </nav>

                            <ul className="flex gap-2 max-md:mx-auto md:ml-auto -mb-2">
                                <li><a href="https://www.youtube.com/c/DellAnnoOficial" target="_blank" className="transition-all opacity-100 hover:opacity-70"><img className="w-6" src={`/site/img/youtube.png`} alt="youtube" /></a></li>
                                <li><a href="https://br.pinterest.com/dellanno/" target="_blank" className="transition-all opacity-100 hover:opacity-70"><img className="w-6" src={`/site/img/pinterest.png`} alt="pinterest" /></a></li>
                                <li><a href="https://www.facebook.com/DellAnnoOficial" target="_blank" className="transition-all opacity-100 hover:opacity-70"><img className="w-6" src={`/site/img/facebook.png`} alt="facebook" /></a></li>
                                <li><a href="https://instagram.com/dellannooficial" target="_blank" className="transition-all opacity-100 hover:opacity-70"><img className="w-6" src={`/site/img/instagram.png`} alt="instagram" /></a></li>
                            </ul>
                        </div>
                        
                        <div className="mb-1 py-5 flex max-sm:flex-col items-center">
                            <nav className="md:ml-[205px] my-2">
                                <ul className="flex max-lg:flex-wrap justify-evenly gap-y-4 gap-x-6 sm:gap-x-4 md:gap-x-14 lg:gap-10">
                                    <li>
                                        <a href="https://dellanno.com/illustrare/" target="_blank" rel="noopener noreferrer" className="block font-secondary text-white text-sm font-light leading-none transition-all opacity-70 hover:opacity-100">Illustrare</a>
                                    </li>

                                    <li>
                                        <Link href={route('Acabamentos.index')} className="block font-secondary text-white text-sm font-light leading-none transition-all opacity-70 hover:opacity-100">Finishes</Link>
                                    </li>
                                    
                                    <li>
                                        <Link href={route('Blog.index')} className="block font-secondary text-white text-sm font-light leading-none transition-all opacity-70 hover:opacity-100">Frame Dell Anno</Link>
                                    </li>

                                    <li>
                                        <Link href={route('Institucional.index') + '#sustainability'} className="block font-secondary text-white text-sm font-light leading-none transition-all opacity-70 hover:opacity-100">Sustainability</Link>
                                    </li>

                                    <li>
                                        <Link href={route('Catalogos.index')} className="block font-secondary text-white text-sm font-light leading-none transition-all opacity-70 hover:opacity-100">Catalogs</Link>
                                    </li>

                                    <li>
                                        <Link href={route('Manual.index')} className="block font-secondary text-white text-sm font-light leading-none transition-all opacity-70 hover:opacity-100">Owner Manual</Link>
                                    </li>
                                </ul>
                            </nav>
                            
                            <nav className="relative max-md:mt-8 md:ml-auto">
                                <ul className="flex max-lg:flex-wrap justify-evenly gap-y-4 gap-x-14 lg:gap-10">
                                    <li>
                                        <Link href={route('Politicas.privacidade')} className="block text-white text-xs text-opacity-65 transition-all hover:text-opacity-100">Privacy Policy</Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="py-1 border-t border-t-white border-opacity-30">
                    <div className="container max-w-x-large">
                        <div className="grid grid-cols-1 md:grid-cols-3 max-md:gap-1 items-center md:h-20 py-4 md:py-0">
                            <span className="text-white text-xs sm:text-sm font-light max-md:text-center opacity-70 mb-5 md:mb-0">
                                Central de Relacionamento com o Cliente | 0800 721 4104
                            </span>

                            <span className="text-white text-xs sm:text-sm font-light text-center opacity-70 mb-5 md:mb-0">
                                © {new Date().getFullYear()} Dell Anno | Todos os direitos reservados.
                            </span>

                            <div className="flex items-center justify-center md:justify-end gap-4">
                                <span className="text-white text-xs sm:text-sm font-light opacity-70">Criado por: </span>
                                <img src={`/site/img/8poroito-logo.png`} className="opacity-50" alt="8poroito" />
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {!notifyCookie || !rejectCookie ? (
                <CookieModal acceptCookies={acceptCookies} visible={notifyCookie ? false : true} />
            ) : null}
        </>
    );
};

export default DefaultLayout;