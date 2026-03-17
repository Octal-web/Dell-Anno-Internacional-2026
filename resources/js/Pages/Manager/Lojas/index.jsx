import { Link, usePage } from '@inertiajs/react';

import { faStore } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { PageSettings } from '@/Components/Manager/PageSettings';
import { FormContent } from '@/Components/Manager/FormContent';
import { BlockContent } from '@/Components/Manager/BlockContent';

const Page = () => {
    // Content
    const { pagina, conteudos, idioma, idiomas, lojas } = usePage().props;

    const breadcrumbItems = [
        // { label: 'Home', link: 'Home.index' },
        // { label: 'Projects', link: 'Home.index' },
    ];
    
    const contentStores = {
        nome: ['Lojas', 'loja'],
        controller: 'Lojas',
        imagens: true,
        imgClass: '',
        editavel: true,
        conteudos: lojas
    };
    
    return (
        <AdminLayout>
            <Breadcrumb icon={faStore} items={breadcrumbItems} current="Lojas" idioma={idioma.codigo} idiomas={idiomas} />
            <PageSettings page={pagina} idioma={idioma.codigo} />

            <FormContent content={conteudos[0]} full={true} idioma={idioma.codigo} />

            <FormContent content={conteudos[1]} full={true} idioma={idioma.codigo} />

            <BlockContent content={contentStores} />
            
        </AdminLayout>
    );
};

export default Page;
