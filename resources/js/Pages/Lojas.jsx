import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { StoresText } from '@/Components/StoresText';
import { StoresRegionFilter } from '@/Components/StoresRegionFilter';
import { StoresList } from '@/Components/StoresList';
import { ProductsForm } from '@/Components/ProductsForm';

const getInitialRegion = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('region');
};

const Page = () => {
    const { conteudos, lojas: initialStores, chamadaForm } = usePage().props;
    const [selectedRegion, setSelectedRegion] = useState(getInitialRegion);
    const [stores, setStores] = useState(initialStores);
    const [loading, setLoading] = useState(true);

    const regions = [
        {nome: 'USA', slug: 'usa'},
        {nome: 'Latin America', slug: 'latin-america'},
        {nome: 'Brazil', slug: 'brazil'}
    ];
    
    useEffect(() => {
        setLoading(false);
    }, []);

    const handleRegionChange = (url) => {
        setLoading(true);

        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['lojas'],
            onSuccess: (page) => {
                setStores(page.props.lojas);
                setLoading(false);
            }
        });
    };
    
    return (
        <DefaultLayout>
            <StoresText content={conteudos[0]}  />

            <StoresRegionFilter
                regions={regions}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                onRegionChange={handleRegionChange}
            />

            <StoresList
                content={conteudos[1]}
                stores={stores}
                loading={loading}
            />
            
            <ProductsForm content={chamadaForm} />
        </DefaultLayout>
    );
};

export default Page;
