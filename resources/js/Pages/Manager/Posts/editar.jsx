import React from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faSave, faImage, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { FormGroup } from '@/Components/Manager/Inputs/FormGroup';

const Page = () => {
    const { idioma, idiomas, categorias, postItem } = usePage().props;

    const { data, setData, post, processing, errors } = useForm(postItem);

    const breadcrumbItems = [
        { label: 'News', link: 'Manager.Blog.index' },
    ];
    
    const highlightOptions = [
        {value: 'nenhum', label: 'Nenhum'},
        {value: 'principal', label: 'Destaque Principal'},
        {value: 'secundario', label: 'Destaque Secundário'}
    ]

    const inputItems = [
        [{ titulo: 'Título', name: 'titulo', tamanho: 'col-span-12 lg:col-span-8', tipo: 'texto', max: 100 }],
        [{ titulo: 'Categoria', name: 'post_categoria_id', tamanho: 'col-span-12 lg:col-span-3', tipo: 'select', options: categorias }, { titulo: 'Tipo de destaque', name: 'destaque', tamanho: 'col-span-12 lg:col-span-3', tipo: 'select', options: highlightOptions }, { titulo: 'Publicado em', name: 'publicado', tamanho: 'col-span-12 lg:col-span-2', tipo: 'data_hora' }],
        [{ titulo: 'Prévia', name: 'previa', tamanho: 'col-span-12 lg:col-span-8', editor: false, tipo: 'texto_longo', max: 300 }],
        [{ titulo: 'Conteúdo', name: 'conteudo', tamanho: 'col-span-12 lg:col-span-8', editor: true, 'toolbar': ['Bold', 'Italic', 'List', 'Link', 'Table', 'Image'], tipo: 'texto_longo', max: 2500 }],
        [{ titulo: 'Imagem', name: 'img', tamanho: 'col-span-12 lg:col-span-8', tipo: 'imagem', crop: true, largura: 960, altura: 600, imagem: postItem.imagem }],
        [{ titulo: 'Título da Página', name: 'titulo_pagina', tamanho: 'col-span-12 lg:col-span-8', tipo: 'texto', max: 100 }],
        [{ titulo: 'Descrição da Página', name: 'descricao_pagina', tamanho: 'col-span-12 lg:col-span-8', editor: false, tipo: 'texto_longo', max: 300 }],
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const idioma_url = new URLSearchParams(window.location.search).get('lang');

        post(route('Manager.Posts.atualizar', {id: postItem.id, lang: idioma_url}), {
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
            <Breadcrumb icon={faNewspaper} items={breadcrumbItems} current="Editar" idioma={idioma.codigo} idiomas={idiomas} id={postItem.id} />

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
                            <Link href={route('Manager.Blog.index')} className="flex items-center w-fit border border-red-700 text-red-700 px-3 py-2 mr-3 cursor-pointer transition-all hover:bg-red-100">
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