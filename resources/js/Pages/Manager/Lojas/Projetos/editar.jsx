import React from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerCombined, faSave, faArrowLeft, faImage } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { FormGroup } from '@/Components/Manager/Inputs/FormGroup';

const Page = () => {
    const { idioma, idiomas, projeto, lojas } = usePage().props;

    const { data, setData, post, processing, errors } = useForm(projeto);

    const breadcrumbItems = [
        { label: 'Inspiração', link: 'Manager.Lojas.Projetos.index' },
        { label: 'Projetos', link: 'Manager.Lojas.Projetos.index' }
    ];
    
    const inputItems = [
        [{ titulo: 'Nome', name: 'nome', tamanho: 'col-span-12 lg:col-span-8', tipo: 'texto', max: 120 }],
        [{ titulo: 'Chamada', name: 'chamada', tamanho: 'col-span-12 md:col-span-8', tipo: 'texto_longo', max: 320 }],
        [{ titulo: 'Dados', name: 'dados', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto', max: 120 }, { titulo: 'Loja', name: 'loja_id', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'select', options: lojas }],
        [{ titulo: 'Descrição', name: 'descricao', tamanho: 'col-span-12 md:col-span-8', tipo: 'texto_longo', editor: true, 'toolbar': ['Bold', 'Italic', 'List'], max: 1020 }],
        [{ titulo: 'Conteúdo', name: 'conteudo', tamanho: 'col-span-12 md:col-span-8', tipo: 'texto_longo', editor: true, 'toolbar': ['Heading', 'Bold', 'Italic', 'List'], max: 1520 }],
        [{ titulo: 'Produtos', name: 'produtos', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto_longo', max: 320 }, { titulo: 'Créditos', name: 'creditos', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto_longo', max: 320 }],
        [{ titulo: 'Título Página', name: 'titulo_pagina', tamanho: 'col-span-12 lg:col-span-8', tipo: 'texto', max: 120 }],
        [{ titulo: 'Descrição Página', name: 'descricao_pagina', tamanho: 'col-span-12 lg:col-span-8', tipo: 'texto_longo', max: 320 }],
        [{ titulo: 'Imagem', name: 'img', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'imagem', crop: true, largura: 860, altura: 560, imagem: projeto.imagem }, { titulo: 'Banner', name: 'img_banner', tamanho: 'col-span-12 md:col-span-6 lg:col-span-6', tipo: 'imagem', crop: true, largura: 1920, altura: 1080, imagem: projeto.banner }],
        [{ titulo: 'Vídeo', name: 'vid', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'video', arquivo: route('Manager.Lojas.Projetos.baixarVideo', { id: projeto.id })}]
    ];
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const idioma_url = new URLSearchParams(window.location.search).get('lang');

        post(route('Manager.Lojas.Projetos.atualizar', {id: projeto.id, lang: idioma_url}), {
            preserveScroll: true,
        });
        console.log(data);

        console.log(errors);
    };

    const onChange = (name, value) => {
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageCrop = (croppedImage, fileExtenstion, name) => {
        setData(prevData => ({
            ...prevData,
            [name]: croppedImage
        }));
    };
    
    return (
        <AdminLayout>
            <Breadcrumb icon={faRulerCombined} items={breadcrumbItems} current="Editar" idioma={idioma.codigo} idiomas={idiomas} id={projeto.id} />

            <div className="mb-6 border border-stroke bg-white px-5 py-5 shadow-md">
                <Link
                    href={route('Manager.Lojas.Projetos.Imagens.index', {id: projeto.id})}
                    className="flex items-center border border-stroke bg-white px-3 py-2 float-right rounded-md transition-all hover:bg-slate-100 ml-2"
                >   
                    <FontAwesomeIcon icon={faImage} className="text-slate-700 mr-2" />
                    Imagens
                </Link>

                <div className="mt-12">
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
                            <Link href={route('Manager.Lojas.Projetos.index')} className="flex items-center w-fit border border-red-700 text-red-700 px-3 py-2 mr-3 cursor-pointer transition-all hover:bg-red-100">
                                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                Voltar
                            </Link>

                            <button type="submit" className="block relative w-fit border border-gray-300 px-3 py-2 cursor-pointer transition-all hover:bg-slate-200">   
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