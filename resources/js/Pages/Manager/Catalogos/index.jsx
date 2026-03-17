import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { ConfirmModal } from '@/Components/Manager/ConfirmModal';
import { PageSettings } from '@/Components/Manager/PageSettings';
import { FormContent } from '@/Components/Manager/FormContent';
import { BlockContent } from '@/Components/Manager/BlockContent';

const Page = () => {
    // Content
    const { pagina, conteudos, idioma, idiomas, catalogos, categorias } = usePage().props;

    const breadcrumbItems = [
        // { label: 'Segmentos', link: 'Manager.Segmentos.index' },
    ];
    const contentCatalogs = {
        nome: ['Catálogos', 'catálogo'],
        controller: 'Catalogos',
        imagens: true,
        imgClass: '',
        editavel: true,
        conteudos: catalogos
    };

    const contentCategories = {
        nome: ['Categorias', 'categoria'],
        controller: 'Catalogos.Categorias',
        imagens: false,
        imgClass: '',
        editavel: true,
        conteudos: categorias
    };

    return (
        <AdminLayout>
            <Breadcrumb icon={faBook} items={breadcrumbItems} current="Catálogos" idioma={idioma.codigo} idiomas={idiomas} />
            
            <BlockContent content={contentCatalogs} />

            <BlockContent content={contentCategories} />
        </AdminLayout>
    );
};

export default Page;
