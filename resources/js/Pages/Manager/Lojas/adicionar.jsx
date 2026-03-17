import React, { useEffect } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { FormGroup } from '@/Components/Manager/Inputs/FormGroup';

const Page = () => {
    const { idioma, estados, paises } = usePage().props;

    const { data, setData, post, processing, errors } = useForm();

    const breadcrumbItems = [
        { label: 'Lojas', link: 'Manager.Lojas.index' },
    ];

    const inputItems = [
        [{ titulo: 'Cidade', name: 'cidade', tamanho: 'col-span-12 lg:col-span-4', tipo: 'texto', max: 120 }, { titulo: 'Estado', name: 'estado', tamanho: 'col-span-4 lg:col-span-1', tipo: 'texto', max: 2 }, { titulo: 'País', name: 'pais_id', tamanho: 'col-span-8 lg:col-span-3', tipo: 'select', options: paises }],
        [{ titulo: 'Link Landing Page', name: 'link_lp', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto', max: 120 }, { titulo: 'Link Incorporado Showroom', name: 'link_showroom', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto', max: 120 }],
        [{ titulo: 'E-mails loja', name: 'emails_lojas', tamanho: 'col-span-12 lg:col-span-8', tipo: 'tag', max: 120 }],
        [{ titulo: 'Endereço', name: 'endereco', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto_longo', editor: false, max: 150 }, { titulo: 'Contato', name: 'contato', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto_longo', editor: false, max: 150 }],
        [{ titulo: 'Horário de Atendimento', name: 'horario_atendimento', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto_longo', editor: false, max: 150 }, { titulo: 'Texto chamada', name: 'chamada', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto_longo', editor: false, max: 250 }],
        [{ titulo: 'Logo', name: 'img_logo', tamanho: 'col-span-12 md:col-span-4', tipo: 'imagem', crop: false, largura: 250, altura: 150 }, { titulo: 'Imagem Showroom', name: 'img_showroom', tamanho: 'col-span-12 md:col-span-6', tipo: 'imagem', crop: true, largura: 1920, altura: 1310 }],
        [{ titulo: 'Imagem', name: 'img', tamanho: 'col-span-12 md:col-span-6', tipo: 'imagem', crop: true, largura: 1920, altura: 760 }],
        [{ titulo: 'Título da Página', name: 'titulo_pagina', tamanho: 'col-span-12 lg:col-span-8', tipo: 'texto', max: 100 }],
        [{ titulo: 'Descrição da Página', name: 'descricao_pagina', tamanho: 'col-span-12 lg:col-span-8', editor: false, tipo: 'texto_longo', max: 300 }],
    ];

    const initializeData = (inputItems) => {
        let initialData = {};
        inputItems.forEach(group => {
            group.forEach(item => {
                initialData[item.name] = item.tipo === 'check' ? false : '';
            });
        });
        return initialData;
    };

    useEffect(() => {
        const initialData = initializeData(inputItems);
        setData(initialData);
    }, []); 

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('Manager.Lojas.novo'), {
            preserveScroll: true
        });
        console.log(data);

        console.log(errors);
    };

    const onChange = (name, value) => {
        setData(name, value);
    };

    const handleImageCrop = (croppedImage, fileExtenstion, name) => {
        setData(prevData => ({
            ...prevData,
            [name]: croppedImage
        }));
    };

    return (
        <AdminLayout>
            <Breadcrumb icon={faBuilding} items={breadcrumbItems} current="Adicionar" idioma={idioma.codigo} />

            <div className="mb-6 border border-stroke bg-white px-5 py-5 shadow-md">
                <div className="mt-10">
                    <form onSubmit={handleSubmit}>
                        {inputItems.map((group, groupIndex) => (
                            <div key={groupIndex} className="grid grid-cols-12 gap-x-6">
                                {group.map((input, index) => (
                                    <div key={index} className={`w-full ${input.tamanho}`}>
                                        <FormGroup
                                            input={input}
                                            idioma={idioma}
                                            value={data[input.name]}
                                            onChange={onChange}
                                            handleImageCrop={handleImageCrop}
                                        />
                                        {errors[input.name] && <p className="text-sm text-red-500 -mt-5 mb-3">{errors[input.name]}</p>}
                                    </div>
                                ))}
                            </div>
                        ))}

                        <div className="flex items-center justify-end">
                            <Link href={route('Manager.Institucional.index')} className="flex items-center w-fit border border-red-700 text-red-700 px-3 py-2 mr-3 cursor-pointer transition-all hover:bg-red-100">
                                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                Voltar
                            </Link>

                            <button
                                type="submit"
                                className="block relative w-fit border border-gray-300 px-3 py-2 cursor-pointer transition-all hover:bg-slate-200"
                            >   
                                <FontAwesomeIcon icon={faSave} className="text-slate-700 mr-2" />
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Page;