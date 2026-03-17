import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { FormGroup } from '@/Components/Manager/Inputs/FormGroup';

export const GeneralData = () => {
    const { idioma, idiomas, dadosGerais } = usePage().props;

    const { data, setData, post, processing, errors } = useForm(dadosGerais);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const contentRef = useRef(null);

    const contentHeight = useRef('0px');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (contentRef.current) {
                contentHeight.current = `${contentRef.current.scrollHeight}px`;
            }
            setIsCollapsed(true);
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);

    const inputItems = [
        [{ titulo: 'Endereço', name: 'endereco', tamanho: 'col-span-12 lg:col-span-4', tipo: 'texto', max: 100 }, { titulo: 'CEP', name: 'cep', tamanho: 'col-span-12 lg:col-span-2', tipo: 'texto', max: 12 }, { titulo: 'Cidade', name: 'cidade', tamanho: 'col-span-12 lg:col-span-2', tipo: 'texto', max: 100 }],
        [{ titulo: 'Telefone', name: 'telefone', tamanho: 'col-span-12 lg:col-span-2', tipo: 'texto', max: 16 }, { titulo: 'Whatsapp Marketing', name: 'whatsapp_mkt', tamanho: 'col-span-12 lg:col-span-2', tipo: 'texto', max: 16 }, , { titulo: 'Whatsapp RH', name: 'whatsapp_rh', tamanho: 'col-span-12 lg:col-span-2', tipo: 'texto', max: 16 }, { titulo: 'E-mail', name: 'email', tamanho: 'col-span-12 lg:col-span-2', tipo: 'texto', max: 50 }],
        [{ titulo: 'Instagram', name: 'instagram', tamanho: 'col-span-12 lg:col-span-3 lg:pr-10', tipo: 'texto', max: 16 }, { titulo: 'Facebook', name: 'facebook', tamanho: 'col-span-12 lg:col-span-3 lg:pr-10 lg:-translate-x-10', tipo: 'texto', max: 16 }, { titulo: 'Linkedin', name: 'linkedin', tamanho: 'col-span-12 lg:col-span-3 lg:pr-10 lg:-translate-x-20', tipo: 'texto', max: 50 }],
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('Manager.Home.atualizarInfo'), {
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

    const toggleCollapse = () => {
        setIsCollapsed(prev => !prev);
    };

    return (
        <div className="mb-6 border border-stroke bg-white px-5 py-5 shadow-md">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">Dados Gerais</h3>

                <button
                    onClick={toggleCollapse}
                    className="relative block ml-auto mr-1 before:content-[''] before:absolute before:-top-1 before:-left-2 before:w-8 before:h-8 before:border before:rounded-full"
                >
                    <FontAwesomeIcon icon={isCollapsed ? faChevronDown : faChevronUp} />
                </button>
            </div>

            <div
                ref={contentRef}
                style={{ height: isCollapsed ? '0px' : contentHeight.current }}
                className="transition-all duration-300 ease-in-out overflow-hidden"
            >
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
        </div>
    );
};