import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { ReactSortable } from "react-sortablejs";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { ImageUploader } from '@/Components/Manager/ImageUploader';
import { IndividualImage } from '@/Components/Manager/IndividualImage';

const Page = () => {
    const { projeto } = usePage().props;

    const [state, setState] = useState(projeto.imagens);
    const previousStateRef = useRef(state);
    const [isUpdated, setIsUpdated] = useState(false);
    const [isReadyToUpload, setIsReadyToUpload] = useState(false);

    const { data, setData, post } = useForm({
        images: []
    });

    const handleImageUpload = (processedImages) => {
        const formData = new FormData();
        
        const imagesData = processedImages.map(({ original, resized }) => ({
            img: original,
            img_alt: resized
        }));

        console.log(imagesData)

        setData('images', imagesData);
        setIsReadyToUpload(true);
    };

    useEffect(() => {
        if (isReadyToUpload && data.images.length > 0) {
            post(route('Manager.Produtos.Projetos.Imagens.novo', { id: projeto.id }), {
                preserveScroll: true,
                preserveState: false,
            });
            setIsReadyToUpload(false);
        }
    }, [isReadyToUpload, data.images]);

    useEffect(() => {
        const previousState = previousStateRef.current;
        if (JSON.stringify(state) !== JSON.stringify(previousState)) {
            const orderedData = state.map((item, index) => ({
                id: item.id,
                ordem: index
            }));

            console.log(orderedData);
            
            setData(prevData => ({ odr: orderedData }));
            setIsUpdated(true);
        }
        previousStateRef.current = state;
    }, [state]);

    useEffect(() => {
        if (isUpdated) {
            post(route('Manager.Produtos.Projetos.Imagens.novo', {id: projeto.id}), {
                preserveScroll: true,
            });
            setIsUpdated(false);
        }
    }, [isUpdated]);

    const breadcrumbItems = [
        { label: 'Produtos', link: 'Manager.Produtos.index' },
        { label: 'Ambientes', link: 'Manager.Produtos.index' },
        { label: projeto.nome, link: 'Manager.Produtos.editar', params: { id: projeto.id } }
    ];

    return (
        <AdminLayout>
            <Breadcrumb icon={faImages} items={breadcrumbItems} current="Galeria" />

            <div className="rounded-sm border border-stroke bg-white px-5 py-5 shadow-md">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-4">
                        <ReactSortable
                            animation={150}
                            list={state}
                            forceFallback={true}
                            setList={setState}
                            filter=".sort-ignore"
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                        >
                            {state.map((image, index) => (
                                <div key={index} className="relative h-full pb-12">
                                    <IndividualImage key={index} individualContent={image} controller="Produtos.Projetos.Imagens" crop={false} />
                                </div>

                            ))}
                        </ReactSortable>
                    </div>

                    <div className="lg:col-span-1 min-h-[calc(100vh-13rem)]">
                        <ImageUploader onUpload={handleImageUpload} crop={false} size={{ largura: 1500, altura: 1080 }} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Page;