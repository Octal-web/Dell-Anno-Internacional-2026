import { Link, usePage } from '@inertiajs/react';

import { faBorderAll } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { PageSettings } from '@/Components/Manager/PageSettings';
import { FormContent } from '@/Components/Manager/FormContent';
import { BlockContent } from '@/Components/Manager/BlockContent';

const Page = () => {
    // Content
    const { pagina, conteudos, idioma, idiomas, acabamentos, acabamentoConteudos } = usePage().props;

    const breadcrumbItems = [
        // { label: 'Inspiração', link: 'Manager.Acabamentos.index' },
        // { label: 'Projects', link: 'Home.index' },
    ];
    
    const contentFinishes = {
        nome: ['Acabamentos', 'acabamento'],
        controller: 'Acabamentos',
        imagens: true,
        imgClass: '',
        editavel: true,
        conteudos: acabamentos
    };
    
    return (
        <AdminLayout>
            <Breadcrumb icon={faBorderAll} items={breadcrumbItems} current="Acabamentos" idioma={idioma.codigo} idiomas={idiomas} />
            <PageSettings page={pagina} idioma={idioma.codigo} />

            <FormContent content={acabamentoConteudos[0]} full={true} idioma={idioma.codigo} />

            <BlockContent content={contentFinishes} />
            
        </AdminLayout>
    );
};

export default Page;
