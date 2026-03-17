import React from 'react';
import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { ProductBanner } from '@/Components/ProductBanner';
import { ProductGrid } from '@/Components/ProductGrid';
import { ProductsForm } from '@/Components/ProductsForm';

const Page = () => {
    const { todosProdutos, produto, chamadaForm, conteudos } = usePage().props;
    
    return (
        <DefaultLayout>
            <ProductBanner products={todosProdutos} content={conteudos[0]} />
            
            <ProductGrid product={produto} />

            <ProductsForm content={chamadaForm} />
        </DefaultLayout>
    );
};

export default Page;
