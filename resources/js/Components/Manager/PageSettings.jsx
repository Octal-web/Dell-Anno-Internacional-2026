import React, { useState, useEffect } from 'react';

import { Link, useForm } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faSave } from '@fortawesome/free-solid-svg-icons';

import { InputText } from './Inputs/InputText';
import { InputTextArea } from './Inputs/InputTextArea';
import { InputFileImage } from './Inputs/InputFileImage';

export const PageSettings = ({ page, idioma }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    const { data, setData, post, processing, errors } = useForm({
        paginasIdiomas: [
            {
                titulo: page.titulo || '',
                descricao: page.descricao || '',
                titulo_compartilhamento: page.titulo_compartilhamento || '',
                descricao_compartilhamento: page.descricao_compartilhamento || '',
            }
        ],
        img: ''
    });

    const handleChange = (name, content) => {
        const [key, index, field] = name.split('.');

        setData((prevData) => {
            const updatedPaginasIdiomas = [...prevData.paginasIdiomas];
            updatedPaginasIdiomas[index][field] = content;
            return { ...prevData, paginasIdiomas: updatedPaginasIdiomas };
        });
    };

    const handleImageCrop = (croppedImage) => {
        setData(prevData => ({
            ...prevData,
            img: croppedImage
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const idioma_url = new URLSearchParams(window.location.search).get('lang');

        post(route('Manager.Paginas.editar', {id: page.id, lang: idioma_url}), {
            preserveScroll: true,

            onSuccess: () => {
                setIsModalOpen(false);
            },
        });
    };

    return (
        <div className="relative mb-6 border border-stroke bg-white px-5 py-5 shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-black">Configurações da Página</h3>
                    <span className="text-sm text-slate-400">Utilize essa seção se você possui conhecimentos sobre SEO.</span>
                </div>
                
                <button className="h-5 w-5 relative mr-3 z-[1] before:content-[''] before:absolute before:-top-2 before:-left-2 before:w-9 before:h-9 before:bg-slate-100 before:rounded-full before:-mt-[-2px] before:-z-[1] before:transition-all before:transform before:scale-0 hover:before:scale-100" onClick={openModal}>
                    <FontAwesomeIcon icon={faCogs} />
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 overflow-y-scroll" onClick={closeModal}>
                    <div className="animate-fade-in-down [animation-duration:_0.1s] rounded-sm border border-stroke bg-white px-5 py-5 my-10 shadow-md max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold mb-1"><FontAwesomeIcon icon={faCogs} className="text-gray-500 mr-1"/> Configurações da página</h2>
                            <button
                                className="text-gray-500"
                                onClick={closeModal}
                            >
                                <svg className="fill-current h-5 w-5 text-gray-300" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <title>Close</title>
                                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-12 gap-x-6">
                                <div className="col-span-12">
                                    <InputText
                                        title="Título"
                                        name="paginasIdiomas.0.titulo"
                                        value={data.paginasIdiomas[0].titulo}
                                        idioma={idioma}
                                        onChange={(name, value) => handleChange(name, value)}
                                    />
                                    {errors['paginasIdiomas.0.titulo'] && <p className="text-sm text-red-500 -mt-5 mb-3">{errors['paginasIdiomas.0.titulo']}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-x-6">
                                <div className="col-span-12">
                                    <InputTextArea
                                        title="Meta descrição"
                                        name="paginasIdiomas.0.descricao"
                                        value={data.paginasIdiomas[0].descricao}
                                        idioma={idioma}
                                        onChange={(name, value) => handleChange(name, value)}
                                    />
                                    {errors['paginasIdiomas.0.descricao'] && <p className="text-sm text-red-500 -mt-5 mb-3">{errors['paginasIdiomas.0.descricao']}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-x-6">
                                <div className="col-span-12">
                                    <InputText
                                        title="Título exibido ao compartilhar"
                                        name="paginasIdiomas.0.titulo_compartilhamento"
                                        value={data.paginasIdiomas[0].titulo_compartilhamento}
                                        idioma={idioma}
                                        onChange={(name, value) => handleChange(name, value)}
                                    />
                                    {errors['paginasIdiomas.0.titulo_compartilhamento'] && <p className="text-sm text-red-500 -mt-5 mb-3">{errors['paginasIdiomas.0.titulo_compartilhamento']}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-x-6">
                                <div className="col-span-12">
                                    <InputTextArea
                                        title="Meta descrição exibida ao compartilhar"
                                        name="paginasIdiomas.0.descricao_compartilhamento"
                                        value={data.paginasIdiomas[0].descricao_compartilhamento}
                                        idioma={idioma}
                                        onChange={(name, value) => handleChange(name, value)}
                                    />
                                    {errors['paginasIdiomas.0.descricao_compartilhamento'] && <p className="text-sm text-red-500 -mt-5 mb-3">{errors['paginasIdiomas.0.descricao_compartilhamento']}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-x-6">
                                <div className="col-span-12">
                                    <InputFileImage imagem={page.imagem} size={{largura: 1280, altura: 720}} onImageCrop={handleImageCrop} />
                                    {errors['imagem'] && <p className="text-sm text-red-500 -mt-5 mb-3">{errors['imagem']}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="block relative w-fit border border-gray-300 px-3 py-2 cursor-pointer transition-all hover:bg-slate-200"
                                >   
                                    <FontAwesomeIcon icon={faSave} /> Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
