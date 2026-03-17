import React from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { FormGroup } from '@/Components/Manager/Inputs/FormGroup';

const Page = () => {
    const { idioma, idiomas, destaque } = usePage().props;

    const { data, setData, post, processing, errors } = useForm(destaque);

    const breadcrumbItems = [
        { label: 'Home', link: 'Manager.Home.index' },
        { label: 'Destaques', link: 'Manager.Home.index' },
    ];
    
    const sizeOptions = [
        { value: 'pequeno', label: 'Pequeno' },
        { value: 'medio', label: 'Médio' },
        { value: 'grande', label: 'Grande' },
    ];
    
    const inputItems = [
        [{ titulo: 'Título', name: 'titulo', tamanho: 'col-span-12 lg:col-span-8', tipo: 'texto', max: 120 }],
        [{ titulo: 'Tamanho', name: 'tamanho', tamanho: 'col-span-12 md:col-span-8', tipo: 'select', options: sizeOptions }],
        [{ titulo: 'Link', name: 'link', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'link', max: 120 }, { titulo: 'Texto Botão', name: 'texto_botao', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto', max: 50 }],
        [{ titulo: 'Texto', name: 'texto', tamanho: 'col-span-12 lg:col-span-8', tipo: 'texto_longo', editor: false, max: 750 }],
        ...((data.tipo === "imagem" || data.tipo === "")
            ? [[{ titulo: 'Imagem', name: 'img', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'imagem', crop: true, largura: 1100, altura: 730, imagem: destaque.imagem}]]
            : [[{ titulo: 'Vídeo', name: 'vid', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'video', arquivo: route('Manager.Destaques.baixarVideo', { id: destaque.id }) }]]
        )
    ];
    
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const idioma_url = new URLSearchParams(window.location.search).get('lang');

        post(route('Manager.Destaques.atualizar', {id: destaque.id, lang: idioma_url}), {
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
            <Breadcrumb icon={faFlag} items={breadcrumbItems} current="Editar" idioma={idioma.codigo} idiomas={idiomas} id={destaque.id} />

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
                            <Link href={route('Manager.Home.index')} className="flex items-center w-fit border border-red-700 text-red-700 px-3 py-2 mr-3 cursor-pointer transition-all hover:bg-red-100">
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