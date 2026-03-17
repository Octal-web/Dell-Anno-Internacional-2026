import React from 'react';
import { Link, usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { CollectionBanner } from '@/Components/CollectionBanner';
import { CollectionEnvironment } from '@/Components/CollectionEnvironment';
import { ProductsForm } from '@/Components/ProductsForm';

const Page = () => {
    const { produto, chamadaForm, conteudos } = usePage().props;
    
    return (
        <DefaultLayout>
            <CollectionBanner product={{banner: produto.banner, nome: produto.nome, descricao: produto.descricao}} />

            {produto.ambientes.map((ambiente, index) => (
                <CollectionEnvironment key={index} environment={ambiente} slug={produto.slug} />
            ))}

            <Link href={route('Produtos.index')} className="block w-fit mx-auto mt-16 mb-24 border border-neutral-800 bg-white font-light text-center uppercase py-2 px-8 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white">All Environments</Link>
            
            <ProductsForm content={chamadaForm} />
        </DefaultLayout>
    );
};

export default Page;
