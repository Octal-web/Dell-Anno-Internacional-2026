import React, { useState, useEffect } from 'react';
import { Link, Head, usePage } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faCouch, faStore, faStar, faBars, faTimes, faPowerOff, faSignOut, faNewspaper, faEnvelope, faFileText, faBorderAll, faBook } from '@fortawesome/free-solid-svg-icons';

import { MenuItem } from '@/Components/Manager/MenuItem';
import { ConfirmModal } from '@/Components/Manager/ConfirmModal';
import { NotificationMessage } from '@/Components/Manager/NotificationMessage';

const menus = [
   
    { id: 1, label: 'Home', icon: faHome, href: route('Manager.Home.index'), controllers: ['Home', 'Slides', 'Campanhas', 'Destaques'] },
    { id: 2, label: 'Institucional', icon: faInfoCircle, href: route('Manager.Institucional.index'),  controllers: ['Institucional', 'Acontecimentos', 'Etapas']},
    { id: 3, label: 'Produtos', icon: faCouch, href: route('Manager.Produtos.index'), controllers: ['Produtos', 'ImagensProdutos']},
    { id: 4, label: 'Lojas', icon: faStore, href: route('Manager.Lojas.index'), controllers: ['Lojas']},
    { id: 5, label: 'Inspiração', icon: faStar, controllers: ['Showrooms', 'LojasProjetos', 'Mostras'], subMenu: [
        { label: 'Showrooms', href: route('Manager.Showrooms.index') },
        { label: 'Projetos', href: route('Manager.Lojas.Projetos.index') },
        { label: 'Mostras de Decoração', href: route('Manager.Mostras.index') }
    ]},
    { id: 6, label: 'Acabamentos', icon: faBorderAll, href: route('Manager.Acabamentos.index'), controllers: ['Acabamentos', 'AcabamentosBlocos']},
    { id: 7, label: 'Blog', icon: faNewspaper, href: route('Manager.Blog.index'), controllers: ['Blog', 'Posts', 'PostsCategorias']},
    { id: 8, label: 'Catálogos', icon: faBook, href: route('Manager.Catalogos.index'), controllers: ['Catalogos']},
    { id: 9, label: 'Contato', icon: faEnvelope, href: route('Manager.Contato.index'), controllers: ['Contato'] },
    { id: 10, label: 'Política de Privacidade', icon: faFileText, href: route('Manager.Politicas.privacidade'), controllers: ['Politicas'] }
];

const AdminEnologiaLayout = ({ children }) => {
    const { controller, action, message } = usePage().props;

    const [openMenuId, setOpenMenuId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

      const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const activeMenu = menus.find(menu => menu.controllers.includes(controller));
        if (activeMenu) {
            setOpenMenuId(activeMenu.id);
        }
    }, [controller]);

    useEffect(() => {
        if (message) {
            const newNotification = { id: Date.now(), ...message };
            setNotifications((prevNotifications) => [...prevNotifications, newNotification]);

            const timer = setTimeout(() => {
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification.id !== newNotification.id)
                );
            }, 5300);

            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <>
            <Head>
                <title>Dell Anno | Manager</title>
                <link rel="icon" href={`/favicon.ico`} type="image/x-icon" />
            </Head>
            <header></header>
            <div className="flex bg-slate-50">
                <div className="fixed top-0 left-0 w-full bg-black z-50 px-4 py-3 flex justify-between items-center md:hidden">
                    <Link href={route('Manager.Home.index')}>
                        <div className="company-logo w-8 h-10 bg-no-repeat bg-center bg-contain invert"></div>
                    </Link>
                    <button onClick={toggleMobileMenu} className="text-white p-2">
                        <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="text-xl" />
                    </button>
                </div>

                <aside className={`menu-aside fixed md:absolute left-0 top-0 z-[2] flex h-full md:h-[calc(100vh-7rem)] w-full md:w-16 md:hover:w-64 flex-col border overflow-hidden bg-white duration-200 ease-linear lg:fixed md:translate-x-0 -translate-x-full md:mx-10 md:my-14 shadow-lg${isMobileMenuOpen ? ' translate-x-0' : ''}`}>
                    <div className="w-64">
                        <div className="flex items-center justify-between gap-2 px-4">
                            <Link href={route('Manager.Home.index')} className="mt-6">
                                <div className="company-logo w-8 h-16 bg-no-repeat bg-top-center bg-contain transition-all hidden md:block">
                                </div>
                            </Link>

                            <button aria-controls="sidebar" aria-expanded="false" className="block lg:hidden text-white">
                                <svg className="fill-current" width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z" fill=""></path>
                                </svg>
                            </button>
                        </div>

                        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                            <nav className="lg:mt-6">
                                <div>
                                    <ul className="mb-6">
                                        {menus.map((menu) => (
                                            <MenuItem
                                                key={menu.id}
                                                id={menu.id}
                                                label={menu.label}
                                                icon={menu.icon}
                                                href={menu.href}
                                                subMenu={menu.subMenu}
                                                isOpen={openMenuId === menu.id}
                                                onToggle={toggleMenu}
                                                controller={controller}
                                                controllers={menu.controllers}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            </nav>

                            <div className="absolute bottom-0 left-0">
                                <button className="text-sm ml-3 mb-3 p-3" onClick={openModal}>
                                    <FontAwesomeIcon icon={faPowerOff} className="text-lg text-black" />
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="md:ml-30 py-3 w-full min-h-screen">
                    <div className="mx-auto max-w-screen-2xl p-4 max-md:mt-16 -mb-4 md:p-6 2xl:p-10">
                        {children}
                    </div>
                </div>
            </div>
            
            {isModalOpen && <ConfirmModal icon={faSignOut} closeModal={closeModal} type="logOut" confirm={route('Manager.Usuarios.logout')} />}


            {notifications.map((notification, key) => (
                <NotificationMessage
                    key={notification.id}
                    type={notification.type}
                    message={notification.msg}
                    show={true}
                    onClose={() =>
                        setNotifications((prevNotifications) =>
                            prevNotifications.filter((n) => n.id !== notification.id)
                        )
                    }
                />
            ))}
        </>
    );
};

export default AdminEnologiaLayout;