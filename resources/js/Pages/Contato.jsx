import React from 'react';
import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { ContactBanner } from '@/Components/ContactBanner';
import { ProductsForm } from '@/Components/ProductsForm';

const Page = () => {
    const { conteudos } = usePage().props;
 
    return (
        <DefaultLayout>
            <ContactBanner content={conteudos[0]} />

            <ProductsForm content={{titulo: conteudos[0].subtitulo}} />
        </DefaultLayout>
    );
};

export default Page;
