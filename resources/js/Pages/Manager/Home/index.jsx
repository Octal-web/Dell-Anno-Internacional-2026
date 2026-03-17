import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { ConfirmModal } from '@/Components/Manager/ConfirmModal';
import { PageSettings } from '@/Components/Manager/PageSettings';
import { FormContent } from '@/Components/Manager/FormContent';
import { BlockContent } from '@/Components/Manager/BlockContent';
import { GeneralData } from '@/Components/Manager/GeneralData';

const Page = () => {
    // Content
    const { pagina, conteudos, idioma, idiomas, slides, campanhas, destaques } = usePage().props;

    const breadcrumbItems = [
        // { label: 'Home', link: 'Home.index' },
        // { label: 'Projects', link: 'Home.index' },
    ];

    const contentSlides = {
        nome: ['Slides', 'slide'],
        controller: 'Slides',
        imagens: false,
        imgClass: '',
        editavel: true,
        conteudos: slides,
        addParametros: ['imagem', 'video']
    };
    
    const contentCampaigns = {
        nome: ['Campanhas', 'campanha'],
        controller: 'Campanhas',
        imagens: true,
        imgClass: '',
        editavel: true,
        conteudos: campanhas
    };
    
    const contentHighlights = {
        nome: ['Destaques', 'destaque'],
        controller: 'Destaques',
        imagens: false,
        imgClass: '',
        editavel: true,
        conteudos: destaques
    };

    return (
        <AdminLayout>
            <Breadcrumb icon={faHome} items={breadcrumbItems} current="Home" idioma={idioma.codigo} idiomas={idiomas} />
            <PageSettings page={pagina} idioma={idioma.codigo} />

            {/* <GeneralData /> */}

            <BlockContent content={contentSlides} />

            <BlockContent content={contentCampaigns} />

            <BlockContent content={contentHighlights} />
            
            <FormContent content={conteudos[0]} full={true} idioma={idioma.codigo} />
            
            <FormContent content={conteudos[1]} full={true} idioma={idioma.codigo} />
        </AdminLayout>
    );
};

export default Page;
