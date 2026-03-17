import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { ConfirmModal } from '@/Components/Manager/ConfirmModal';
import { PageSettings } from '@/Components/Manager/PageSettings';
import { FormContent } from '@/Components/Manager/FormContent';
import { BlockContent } from '@/Components/Manager/BlockContent';

const Page = () => {
    // Content
    const { pagina, conteudos, idioma, idiomas, posts, postsCategorias } = usePage().props;

    const breadcrumbItems = [
        // { label: 'Home', link: 'Home.index' },
        // { label: 'Projects', link: 'Home.index' },
    ];

    const contentPosts = {
        nome: ['Posts', 'post'],
        controller: 'Posts',
        imagens: true,
        imgClass: '',
        editavel: true,
        conteudos: posts
    };

    const contentCategories = {
        nome: ['Categorias', 'categoria'],
        controller: 'Posts.Categorias',
        imagens: false,
        imgClass: '',
        editavel: true,
        conteudos: postsCategorias
    };
    
    return (
        <AdminLayout>
            <Breadcrumb icon={faNewspaper} items={breadcrumbItems} current="Blog" idioma={idioma.codigo} idiomas={idiomas} />
            <PageSettings page={pagina} idioma={idioma.codigo} />
            
            <BlockContent content={contentPosts} />

            <BlockContent content={contentCategories} />
        </AdminLayout>
    );
};

export default Page;
