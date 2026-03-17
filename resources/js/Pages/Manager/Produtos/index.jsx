import { Link, usePage } from '@inertiajs/react';

import { faCouch } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { PageSettings } from '@/Components/Manager/PageSettings';
import { FormContent } from '@/Components/Manager/FormContent';
import { BlockContent } from '@/Components/Manager/BlockContent';

const Page = () => {
    // Content
    const { pagina, conteudos, idioma, idiomas, produtos } = usePage().props;

    const breadcrumbItems = [
        // { label: 'Home', link: 'Home.index' },
        // { label: 'Projects', link: 'Home.index' },
    ];
    
    const contentProducts = {
        nome: ['Produtos', 'produto'],
        controller: 'Produtos',
        imagens: true,
        imgClass: '',
        editavel: true,
        conteudos: produtos
    };
    
    return (
        <AdminLayout>
            <Breadcrumb icon={faCouch} items={breadcrumbItems} current="Produtos" idioma={idioma.codigo} idiomas={idiomas} />
            <PageSettings page={pagina} idioma={idioma.codigo} />

            <FormContent content={conteudos[0]} full={true} idioma={idioma.codigo} />

            <BlockContent content={contentProducts} />

            <FormContent content={conteudos[1]} full={true} idioma={idioma.codigo} />
            
        </AdminLayout>
    );
};

export default Page;
