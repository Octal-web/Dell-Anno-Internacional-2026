import { Link, usePage } from '@inertiajs/react';

import { faPalette } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { PageSettings } from '@/Components/Manager/PageSettings';
import { FormContent } from '@/Components/Manager/FormContent';
import { BlockContent } from '@/Components/Manager/BlockContent';

const Page = () => {
    // Content
    const { pagina, conteudos, idioma, idiomas, mostras } = usePage().props;

    const breadcrumbItems = [
        { label: 'Inspiração', link: 'Manager.Mostras.index' },
        // { label: 'Projects', link: 'Home.index' },
    ];
    
    const contentFairs = {
        nome: ['Mostras', 'mostra'],
        controller: 'Mostras',
        imagens: true,
        imgClass: '',
        editavel: true,
        conteudos: mostras
    };
    
    return (
        <AdminLayout>
            <Breadcrumb icon={faPalette} items={breadcrumbItems} current="Mostras de decoração" idioma={idioma.codigo} idiomas={idiomas} />
            <PageSettings page={pagina} idioma={idioma.codigo} />

            <FormContent content={conteudos[0]} full={true} idioma={idioma.codigo} />

            <FormContent content={conteudos[1]} full={true} idioma={idioma.codigo} />

            <BlockContent content={contentFairs} />
            
        </AdminLayout>
    );
};

export default Page;
