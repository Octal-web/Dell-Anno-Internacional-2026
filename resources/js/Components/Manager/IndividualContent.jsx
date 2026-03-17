import React, { useState, useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { ConfirmModal } from './ConfirmModal';

export const IndividualContent = ({ individualContent, imagensPath, imagensClass, controller, index }) => {
    const [isChecked, setIsChecked] = useState(individualContent.visivel || false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        visivel: isChecked
    });

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        setLoading(true);

        post(route('Manager.' + controller + '.visibilidade', {id: individualContent.id}), {
            preserveScroll: true,
            onSuccess: (response) => {
                if (response.props.message && response.props.message.type === 'success') {
                    setIsChecked(!isChecked);
                } else {
                    setIsChecked(isChecked);
                }
            },
            onError: () => {
                setIsChecked(isChecked);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        setIsChecked(individualContent.visivel);
    }, [individualContent?.visivel])

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <label className="cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isChecked} 
                            onChange={handleCheckboxChange}
                            className="sr-only peer"
                            disabled={loading}
                        />
                        <div className={`relative w-9 h-5 ${loading ? 'opacity-50' : ''} bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600`} />
                    </label>
                    <span className="font-medium text-gray-700 line-clamp-1 ml-3" dangerouslySetInnerHTML={{ __html: individualContent.titulo ? individualContent.titulo : individualContent.nome }} />
                </div>
            </div>

            <div className="flex justify-center min-h-40 mb-6">
                <img src={individualContent.imagem ?? individualContent.logo} className={`p-4 max-h-100 max-w-60 w-full object-contain border border-stroke ${imagensClass ? imagensClass : ''}`} />
            </div>

            <div className="flex justify-end mb-4 sort-ignore">
                <Link href={route('Manager.' + controller + '.editar', {id: individualContent.id})} className="h-5 w-5 relative mr-4 z-[1] before:content-[''] before:absolute before:-top-[7px] before:-left-[10px] before:w-9 before:h-9 before:bg-slate-100 before:rounded-full before:-mt-[-2px] before:-z-[1] before:transition-all before:transform before:scale-0 hover:before:scale-100">
                    <FontAwesomeIcon icon={faEdit} className="text-slate-700" />
                </Link>

                <button className="h-5 w-5 relative z-[1] before:content-[''] before:absolute before:-top-[7px] before:-left-[8px] before:w-9 before:h-9 before:bg-slate-100 before:rounded-full before:-mt-[-2px] before:-z-[1] before:transition-all before:transform before:scale-0 hover:before:scale-100" onClick={openModal}>
                    <FontAwesomeIcon icon={faTrash} className="text-red-700" />
                </button>
            </div>

            {isModalOpen && <ConfirmModal icon={faTrash} closeModal={closeModal} type="delete" confirm={route('Manager.' + controller + '.excluir', {id: individualContent.id})} />}
        </>
    );
};
