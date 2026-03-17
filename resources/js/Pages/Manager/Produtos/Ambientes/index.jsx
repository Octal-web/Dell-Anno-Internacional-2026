import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { BlockContent } from '@/Components/Manager/BlockContent';

const Page = () => {
    // Content
    const { idioma, idiomas, produto } = usePage().props;

    const breadcrumbItems = [
        { label: 'Produtos', link: 'Manager.Produtos.index' },
        { label: produto.nome, link: 'Manager.Produtos.editar', params: { id: produto.id }},
    ];

    const contentEnvironments = {
        nome: ['Ambientes', 'ambiente'],
        controller: 'Produtos.Ambientes',
        imagens: false,
        addId: produto.id,
        editavel: true,
        conteudos: produto.ambientes
    };

    const contentProjects = {
        nome: ['Projetos', 'projeto'],
        controller: 'Produtos.Projetos',
        imagens: true,
        addId: produto.id,
        editavel: true,
        conteudos: produto.projetos
    };

    return (
        <AdminLayout>
            <Breadcrumb icon={faHouse} items={breadcrumbItems} current="Ambientes" idioma={idioma.codigo} idiomas={idiomas} id={produto.id} />

            <BlockContent content={contentEnvironments} />
            
            <BlockContent content={contentProjects} />
        </AdminLayout>
    );
};

export default Page;
