import React from "react";
import { Link, useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

import AuthLayout from '@/Layouts/AuthLayout';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FlashMessage } from '@/Components/Manager/FlashMessage';

const Login = () => {
    const { message } = usePage().props;

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();

        post(route('login'), {
            preserveScroll: true,
        });
    };

    const currentYear = new Date().getFullYear();

    return (
        <AuthLayout>
            <div className="min-h-screen flex flex-col justify-center items-center bg-white text-white">
                <div className="w-full max-w-[400px] animate-fade-in-down">
                    <div className="p-8 space-y-8 bg-white bg-opacity-10 shadow-lg">
                        <div className="flex justify-center">
                            <img src={`/admin/img/logo.png`} className="my-3 w-44" />
                        </div>
                        
                        <form method="POST" className="mx-3 space-y-6" onSubmit={handleSubmit}>
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div className="mb-5">
                                    <label htmlFor="email" className="sr-only">E-mail</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        className="appearance-none relative block w-full px-3 py-2 text-sm border border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-black focus:border-black focus:ring-black"
                                        placeholder="E-mail"
                                        value={data.email}
                                        onChange={handleChange}
                                    />
                                </div>
                        
                                <div>
                                    <label htmlFor="password" className="sr-only">Senha</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="appearance-none relative block w-full px-3 py-2 text-sm border border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-black focus:border-black focus:ring-black"
                                        placeholder="Senha"
                                        value={data.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {message && (
                                <FlashMessage type={message.type} message={message.message} />
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Link
                                        href={route('Home.index')}
                                        className="text-xs text-white font-semibold hover:underline"
                                    >   
                                        <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                                        Ir para o site
                                    </Link>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="group relative w-full py-2 px-5 border border-transparent text-sm text-white bg-black hover:bg-opacity-80 transition-all"
                                    >
                                        <FontAwesomeIcon icon={faRightToBracket} className="mr-2 mt-1" />
                                        Login
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    <div className="mt-6 text-center text-sm text-gray-400">
                        &copy; {currentYear} Dell Anno. Desenvolvido por Octal Web.
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Login;
