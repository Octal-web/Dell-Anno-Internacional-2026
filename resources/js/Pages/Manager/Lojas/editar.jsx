import React, { useState, useEffect } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';

import Select from 'react-select';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { FormGroup } from '@/Components/Manager/Inputs/FormGroup';

const Page = () => {
    const { idioma, idiomas, selectCidades, estados, paises, loja } = usePage().props;
    const [cities, setCities] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedStates, setSelectedStates] = useState(
        loja.estados.map(id =>
            estados.find(s => s.value === id)
        )
    );
    
    const [selectedCities, setSelectedCities] = useState(
        loja.cidades.map(id =>
            selectCidades.find(c => c.value === id)
        )
    );

    const [citySearchTerm, setCitySearchTerm] = useState('');

    const { data, setData, post, processing, errors } = useForm(loja);

    const breadcrumbItems = [
        { label: 'Lojas', link: 'Manager.Lojas.index' },
    ];

    const inputItems = [
        [{ titulo: 'Cidade', name: 'cidade', tamanho: 'col-span-12 lg:col-span-4', tipo: 'texto', max: 120 }, { titulo: 'Estado', name: 'estado', tamanho: 'col-span-4 lg:col-span-1', tipo: 'texto', max: 2 }, { titulo: 'País', name: 'pais_id', tamanho: 'col-span-8 lg:col-span-3', tipo: 'select', options: paises }],
        [{ titulo: 'Link Landing Page', name: 'link_lp', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto', max: 120 }, { titulo: 'Link Incorporado Showroom', name: 'link_showroom', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto', max: 120 }],
        [{ titulo: 'E-mails loja', name: 'emails_lojas', tamanho: 'col-span-12 lg:col-span-8', tipo: 'tag', max: 120 }],
        [{ titulo: 'Endereço', name: 'endereco', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto_longo', editor: false, max: 150 }, { titulo: 'Contato', name: 'contato', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto_longo', editor: false, max: 150 }],
        [{ titulo: 'Horário de Atendimento', name: 'horario_atendimento', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto_longo', editor: false, max: 150 }, { titulo: 'Texto chamada', name: 'chamada', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto_longo', editor: false, max: 350 }],
        [{ titulo: 'Logo', name: 'img_logo', tamanho: 'col-span-12 md:col-span-4', tipo: 'imagem', crop: false, largura: 250, altura: 150, imagem: loja.logo }, { titulo: 'Imagem Showroom', name: 'img_showroom', tamanho: 'col-span-12 md:col-span-6', tipo: 'imagem', crop: true, largura: 1920, altura: 1310, imagem: loja.imagem_showroom }],
        [{ titulo: 'Imagem', name: 'img', tamanho: 'col-span-12 md:col-span-6', tipo: 'imagem', crop: true, largura: 1920, altura: 760, imagem: loja.imagem }],
        [{ titulo: 'Título da Página', name: 'titulo_pagina', tamanho: 'col-span-12 lg:col-span-8', tipo: 'texto', max: 100 }],
        [{ titulo: 'Descrição da Página', name: 'descricao_pagina', tamanho: 'col-span-12 lg:col-span-8', editor: false, tipo: 'texto_longo', max: 300 }],
    ];
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const idioma_url = new URLSearchParams(window.location.search).get('lang');

        post(route('Manager.Lojas.atualizar', {id: loja.id, lang: idioma_url}), {
            preserveScroll: true,
        });
        console.log(data);

        console.log(errors);
    };

    const handleStateSelect = (selectedState) => {
        if (selectedState && !selectedStates.find(state => state.value === selectedState.value)) {
            setSelectedStates(prev => [...prev, selectedState]);
        }
    };

    const handleCitySelect = (selectedCity) => {
        if (selectedCity && !selectedCities.find(city => city.value === selectedCity.value)) {
            setSelectedCities(prev => [...prev, selectedCity]);
            setCitySearchTerm('');
        }
    };

    const removeCity = (cityToRemove) => {
        setSelectedCities(prev => prev.filter(city => city.value !== cityToRemove.value));
    };

    const removeState = (stateToRemove) => {
        setSelectedStates(prev => prev.filter(state => state.value !== stateToRemove.value));
        setSelectedCities(prev => prev.filter(city => city.stateId !== stateToRemove.value));
    };

    const loadCities = async (searchTerm) => {
        if (!searchTerm || searchTerm.length < 3) {
            setCities([]);
            return;
        }

        setIsProcessing(true);

        try {
            const response = await axios.post(route('Manager.Cidades.carregar'), {
                q: searchTerm,
            });

            if (response.data) {
                setCities(response.data.cidades);
            }
        } catch (error) {
            console.error('Error carregando cidades:', error);
            setCities([]);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadCities(citySearchTerm);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [citySearchTerm]);

    const onChange = (name, value) => {
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageCrop = (croppedImage, fileExtension, name) => {
        setData(prevData => ({
            ...prevData,
            [name]: croppedImage
        }));

        if (name === 'img') {
            const resizeBlobImage = (blob, scale = 0.40625) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        const newWidth = img.width * scale;
                        const newHeight = img.height * scale;

                        canvas.width = newWidth;
                        canvas.height = newHeight;
                        ctx.drawImage(img, 0, 0, newWidth, newHeight);

                        canvas.toBlob(resizedBlob => {
                            resolve(resizedBlob);
                        }, blob.type);
                    };

                    img.src = URL.createObjectURL(blob);
                });
            };

            resizeBlobImage(croppedImage).then(resizedBlob => {
                setData(prevData => ({
                    ...prevData,
                    [`${name}_alt`]: resizedBlob
                }));
            });
        }
    };
    
    const availableStates = estados.filter(state =>
        !selectedStates.find(selected => selected.value === state.value)
    );

    const availableCities = cities.map(group => ({
        ...group,
        options: group.options?.filter(city =>
            !selectedCities.find(selected => selected.value === city.value)
        ) || []
    })).filter(group => group.options.length > 0);

    return (
        <AdminLayout>
            <Breadcrumb icon={faBuilding} items={breadcrumbItems} current="Editar" idioma={idioma.codigo} idiomas={idiomas} id={loja.id} />

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

                        <h3 className="text-xl font-bold text-black border-b pb-2 my-6 max-w-[935px]">Área de cobertura</h3>
                            <div className="grid grid-cols-12 gap-x-6">
                                <div className="md:col-span-4">
                                    <div className="flex items-center mb-2">
                                        <img src={`/admin/img/flags/${idioma.icone}`} className="w-5 mr-1" alt={`${idioma.nome} flag`} />
                                        <label htmlFor="state_select" className="block font-bold text-gray-500">Estados atendidos</label>
                                    </div>

                                    <Select
                                        id="state_select"
                                        options={availableStates}
                                        value={null}
                                        onChange={handleStateSelect}
                                        isDisabled={processing}
                                        placeholder="Pesquisar por estados"
                                        classNamePrefix="admin-select"
                                    />
                                    {selectedStates.length > 0 && (
                                        <div className="mt-3 mb-10 flex flex-wrap gap-2">
                                            {selectedStates.map((state) => (
                                                <div key={state.value} className="inline-flex items-center bg-gray-100 px-3 py-1 text-xs">
                                                    <span className="mr-2">{state.label}</span>
                                                    <button type="button" onClick={() => removeState(state)}>✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {errors.states && <p className="text-xs text-white bg-red-900 px-3 py-1.5 mt-2">{errors.states}</p>}
                                </div>

                                <div className="md:col-span-4">
                                    <div className="flex items-center mb-2">
                                        <img src={`/admin/img/flags/${idioma.icone}`} className="w-5 mr-1" alt={`${idioma.nome} flag`} />
                                        <label htmlFor="city_search" className="block font-bold text-gray-500">Cidades atendidas</label>
                                    </div>

                                    <Select
                                        id="city_search"
                                        options={availableCities}
                                        value={null}
                                        onChange={handleCitySelect}
                                        onInputChange={(inputValue) => setCitySearchTerm(inputValue)}
                                        inputValue={citySearchTerm}
                                        placeholder="Pesquisar por cidades"
                                        classNamePrefix="admin-select"
                                        noOptionsMessage={() =>
                                            citySearchTerm.length < 3
                                                ? "Digite ao menos 3 caracteres"
                                                : isProcessing 
                                                    ? "Pesquisando..."
                                                    : "Nenhuma cidade encontrada"
                                        }
                                    />
                                    {selectedCities.length > 0 && (
                                        <div className="mt-3 mb-10 flex flex-wrap gap-2">
                                            {selectedCities.map((city) => (
                                                <div key={city.value} className="inline-flex items-center bg-gray-100 px-3 py-1 text-xs">
                                                    <span className="mr-2">{city.label}</span>
                                                    <button type="button" onClick={() => removeCity(city)}>✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {errors.cities && <p className="text-xs text-white bg-red-900 px-3 py-1.5 mt-2">{errors.cities}</p>}
                                </div>
                            </div>

                        <div className="flex items-center justify-end">
                            <Link href={route('Manager.Lojas.index')} className="flex items-center w-fit border border-red-700 text-red-700 px-3 py-2 mr-3 cursor-pointer transition-all hover:bg-red-100">
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