import React, { useState, useEffect, useRef } from 'react';
import { Link, useForm } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faSave, faImage, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { InputText } from './Inputs/InputText';
import { InputTextArea } from './Inputs/InputTextArea';
import { InputTipTapEditor } from './Inputs/InputTipTapEditor';
import { InputFileImage } from './Inputs/InputFileImage';
import { InputLink } from './Inputs/InputLink';

export const FormContent = ({ content, full, toolbar, idioma }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const contentRef = useRef(null);

    const contentHeight = useRef('0px');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (contentRef.current) {
                contentHeight.current = `${contentRef.current.scrollHeight}px`;
            }
            setIsCollapsed(content.minimizavel);
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const { data, setData, post, processing, errors } = useForm({
        conteudosIdiomas: [
            {
                ...(content.titulo ? { titulo: content.titulo } : {}),
                ...(content.subtitulo ? { subtitulo: content.subtitulo } : {}),
                ...(content.texto ? { texto: content.texto } : {}),
                ...(content.link ? { link: content.link } : {}),
                ...(content.nova_aba !== undefined ? { nova_aba: content.nova_aba } : {}),
                ...(content.video ? { video: content.video } : {}),
            }
        ],
        ...(content.img ? { img: content.img } : {})
    });


    const handleChange = (name, content) => {
        const [key, index, field] = name.split('.');

        setData((prevData) => {
            const updatedConteudosIdiomas = [...prevData.conteudosIdiomas];
            updatedConteudosIdiomas[index][field] = content;
            return { ...prevData, conteudosIdiomas: updatedConteudosIdiomas };
        });
    };

    const handleCheckboxChange = (name, checked) => {
        setData((prevData) => {
            const updatedConteudosIdiomas = [...prevData.conteudosIdiomas];
            updatedConteudosIdiomas[0][name] = checked;
            return { ...prevData, conteudosIdiomas: updatedConteudosIdiomas };
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

        post(route('Manager.Conteudos.editar', {id: content.id, lang: idioma_url}), {
            preserveScroll: true,
        });

        console.log(data)
    };

    const toggleCollapse = () => {
        setIsCollapsed(prev => !prev);
    };

    return (
        <div className={`mb-6 border border-stroke bg-white px-5 py-5 shadow-md ${content.minimizavel && ' h-fit'}`}>
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">{content.bloco}</h3>

                {content.galeria &&
                    <Link
                        href={route('Manager.Imagens.conteudo', {id: content.id})}
                        className="flex items-center border border-stroke bg-white px-3 py-2 rounded-md transition-all hover:bg-slate-100 ml-2"
                    >   
                        <FontAwesomeIcon icon={faImage} className="text-slate-700 mr-2" />
                        Imagens
                    </Link>
                }

                {content.minimizavel &&
                    <button
                        onClick={toggleCollapse}
                        className="relative block ml-auto mr-1 before:content-[''] before:absolute before:-top-1 before:-left-2 before:w-8 before:h-8 before:border before:rounded-full"
                    >
                        <FontAwesomeIcon icon={isCollapsed ? faChevronDown : faChevronUp} />
                    </button>
                }
            </div>

            <div
                ref={contentRef}
                style={{ height: content.minimizavel ? (isCollapsed ? '0px' : contentHeight.current) : 'auto' }}
                className="transition-all duration-300 ease-in-out overflow-hidden"
            >
                <div className="mt-10">
                    <form onSubmit={handleSubmit}>
                        { content.habilitar_titulo &&
                            <div className="grid grid-cols-12 gap-x-6">
                                <div className={`col-span-12 ${full ? ' lg:col-span-8' : ''}`}>
                                    <InputText
                                        title="Título"
                                        name="conteudosIdiomas.0.titulo"
                                        value={data.conteudosIdiomas[0].titulo}
                                        idioma={idioma}
                                        onChange={(name, value) => handleChange(name, value)}
                                    />
                                    {errors['conteudosIdiomas.0.titulo'] && <p className="text-sm text-red-500 -mt-5 mb-3">{errors['conteudosIdiomas.0.titulo']}</p>}
                                </div>
                            </div>
                        }

                        { content.habilitar_subtitulo &&
                            <div className="grid grid-cols-12 gap-x-6">
                                <div className={`col-span-12 ${full ? ' lg:col-span-8' : ''}`}>
                                    <InputText
                                        title="Subtítulo"
                                        name="conteudosIdiomas.0.subtitulo"
                                        value={data.conteudosIdiomas[0].subtitulo}
                                        idioma={idioma}
                                        onChange={(name, value) => handleChange(name, value)}
                                    />
                                    {errors['conteudosIdiomas.0.subtitulo'] && <p className="text-sm text-red-500 -mt-5 mb-3">{errors['conteudosIdiomas.0.subtitulo']}</p>}
                                </div>
                            </div>
                        }

                        { content.habilitar_texto &&
                            <div className="grid grid-cols-12 gap-x-6">
                                <div className={`col-span-12 ${full ? ' lg:col-span-8' : ''}`}>
                                    { content.texto_formatado ?
                                        <InputTipTapEditor
                                            title="Texto"
                                            name="conteudosIdiomas.0.texto"
                                            toolbar={['Bold', 'Italic', ...(toolbar || [])]}
                                            value={data.conteudosIdiomas[0].texto}
                                            idioma={idioma}
                                            onChange={(name, content) => handleChange(name, content)}
                                        />
                                    :
                                        <InputTextArea
                                            title="Texto"
                                            name="conteudosIdiomas.0.texto"
                                            value={data.conteudosIdiomas[0].texto}
                                            idioma={idioma}
                                            onChange={(name, value) => handleChange(name, value)}
                                        />
                                    }
                                    {errors['conteudosIdiomas.0.texto'] && <p className="text-sm text-red-500 -mt-5 mb-3">{errors['conteudosIdiomas.0.texto']}</p>}
                                </div>
                            </div>
                        }

                        { content.habilitar_link &&
                            <div className="grid grid-cols-12 gap-x-6">
                                <div className={`col-span-12 ${full ? ' lg:col-span-8' : ''}`}>
                                    <InputLink
                                        title="Link"
                                        name="conteudosIdiomas.0.link"
                                        value={data.conteudosIdiomas[0].link}
                                        idioma={idioma}
                                        onChange={(name, value) => handleChange(name, value)}
                                        onCheck={(name, value) => handleCheckboxChange(name, value)}
                                        novaAba={data.conteudosIdiomas[0].nova_aba}
                                    />
                                    {errors['conteudosIdiomas.0.link'] && <p className="text-sm text-red-500 -mt-5 mb-3">{errors['conteudosIdiomas.0.link']}</p>}
                                </div>
                            </div>
                        }

                        { content.habilitar_video &&
                            <div className="grid grid-cols-12 gap-x-6">
                                <div className={`col-span-12 ${full ? ' lg:col-span-8' : ''}`}>
                                    <InputLink
                                        title="Vídeo"
                                        name="conteudosIdiomas.0.video"
                                        value={data.conteudosIdiomas[0].video}
                                        idioma={idioma}
                                        onChange={(name, value) => handleChange(name, value)}
                                    />
                                    {errors['conteudosIdiomas.0.video'] && <p className="text-sm text-red-500 -mt-5 mb-3">{errors['conteudosIdiomas.0.video']}</p>}
                                </div>
                            </div>
                        }

                        { content.habilitar_img &&
                            <div className="grid grid-cols-12 gap-x-6">
                                <div className={`col-span-12 ${full ? ' lg:col-span-8' : ''}`}>
                                    <InputFileImage title="Imagem" imagem={content.imagem} size={{largura: content.largura_img, altura: content.altura_img}} crop={content.recortar_img ? true : false} onImageCrop={handleImageCrop} />
                                    {errors['img'] && <p className="text-sm text-red-500 -mt-5 mb-3">{errors['img']}</p>}
                                </div>

                                { content.habilitar_img_mobile &&
                                    <div className={`col-span-12 ${full ? ' lg:col-span-4' : ''}`}>
                                        <InputFileImage title="Imagem Mobile" imagem={content.imagem_mobile} size={{largura: content.largura_img_mobile, altura: content.altura_img_mobile}} crop={content.recortar_img_mobile ? true : false} onImageCrop={handleImageCrop} />
                                        {errors['img_mobile'] && <p className="text-sm text-red-500 -mt-5 mb-3">{errors['img_mobile']}</p>}
                                    </div>
                                }
                            </div>
                        }

                        <div className="flex items-center justify-end">
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
