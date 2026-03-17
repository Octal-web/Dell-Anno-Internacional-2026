import React from 'react';
import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { ProjectBanner } from '@/Components/ProjectBanner';
import { ProjectGrid } from '@/Components/ProjectGrid';
import { ProjectContent } from '@/Components/ProjectContent';
import { OtherProductsList } from '@/Components/OtherProductsList';
import { ProductsForm } from '@/Components/ProductsForm';

const Page = () => {
    const { projeto, outrosProdutos, chamadaForm } = usePage().props;
    
    return (
        <DefaultLayout>
            <ProjectBanner project={{banner: projeto.imagem, nome: projeto.ambiente_nome, descricao: projeto.ambiente_descricao}} />

            {/* <ProjectGallery text={projeto.detalhes} slides={projeto.imagens} /> */}

            <ProjectGrid project={projeto} />

            <ProjectContent banner={projeto.banner} text={projeto.conteudo} />

            <OtherProductsList products={outrosProdutos} />

            <ProductsForm content={chamadaForm} />
        </DefaultLayout>
    );
};

export default Page;
