import React from 'react';
import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { ProductsList } from '@/Components/ProductsList';
import { ProductsForm } from '@/Components/ProductsForm';

const Page = () => {
    const { produtos, conteudos } = usePage().props;
    
    return (
        <DefaultLayout>
            <ProductsList content={conteudos[0]} products={produtos} />

            <ProductsForm content={conteudos[1]} />
        </DefaultLayout>
    );
};

export default Page;
