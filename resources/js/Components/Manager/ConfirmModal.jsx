import React, { useEffect } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const ConfirmModal = ({ closeModal, type, confirm, icon }) => {
    const { message } = usePage().props;

    const { post, processing, errors } = useForm();

    const handleSubmit = (e) => {
        e.preventDefault();

        post(confirm, {
            preserveState: false,
            onSuccess: () => {
                closeModal();
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const messages = {
        logOut: {
            title: 'Log Out?',
            call: 'Tem certeza que deseja sair?',
            message: 'Pressione [Não] se quiser continuar o trabalho. Pressione [Sim] para sair do usuário atual.'
        },
        delete: {
            title: 'Excluir?',
            call: 'Tem certeza que deseja excluir?',
            message: 'Pressione [Não] se quiser confirmar a exclusão. Pressione [Sim] para cancelar.'
        },
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[99999] sort-ignore">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
            <div className="animate-fade-in-down [animation-duration:_0.1s] border border-stroke bg-white max-w-xl px-8 py-12 text-center shadow-md relative">
                <FontAwesomeIcon icon={icon} className="text-2xl text-red-500 bg-red-100 p-4 rounded-full mb-6" />
                <h2 className="text-2xl font-bold mb-2">{messages[type]['title']}</h2>
                <p className="text-slate-500 mb-10">{messages[type]['call']}<br />
                    {messages[type]['message']}
                </p>
                <div className="mx-auto flex gap-x-6 max-w-96">
                    <div className="w-full">
                        <button
                            className="w-full bg-gray-100 border border-slate-200 text-primary py-2 px-4 mr-2 hover:bg-gray-200"
                            onClick={closeModal}
                        >
                            Não
                        </button>
                    </div>

                    <div className="w-full">
                        <button
                            className="block w-full bg-red-500 border border-red-500 text-white py-2 px-4 mr-2 hover:bg-red-600"
                            onClick={handleSubmit}
                        >
                            Sim
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
