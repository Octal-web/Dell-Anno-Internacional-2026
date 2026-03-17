import { Link, usePage } from '@inertiajs/react';

import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { PageSettings } from '@/Components/Manager/PageSettings';
import { FormContent } from '@/Components/Manager/FormContent';
import { BlockContent } from '@/Components/Manager/BlockContent';

const Page = () => {
    // Content
    const { pagina, conteudos, idioma, idiomas, showrooms } = usePage().props;

    const breadcrumbItems = [
        { label: 'Inspiração', link: 'Manager.Showrooms.index' },
        // { label: 'Showrooms', link: 'Manager.Showrooms.index' },
    ];
    
    const contentShowrooms = {
        nome: ['Showrooms', 'showroom'],
        controller: 'Showrooms',
        imagens: true,
        imgClass: '',
        editavel: true,
        conteudos: showrooms
    };
    
    return (
        <AdminLayout>
            <Breadcrumb icon={faDoorOpen} items={breadcrumbItems} current="Showrooms" idioma={idioma.codigo} idiomas={idiomas} />
            <PageSettings page={pagina} idioma={idioma.codigo} />

            <FormContent content={conteudos[0]} full={true} idioma={idioma.codigo} />

            <FormContent content={conteudos[1]} full={true} idioma={idioma.codigo} />

            <BlockContent content={contentShowrooms} />
            
        </AdminLayout>
    );
};

export default Page;
