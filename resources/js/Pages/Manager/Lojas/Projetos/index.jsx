import { Link, usePage } from '@inertiajs/react';

import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { PageSettings } from '@/Components/Manager/PageSettings';
import { FormContent } from '@/Components/Manager/FormContent';
import { BlockContent } from '@/Components/Manager/BlockContent';

const Page = () => {
    // Content
    const { pagina, conteudos, idioma, idiomas, projetos } = usePage().props;

    const breadcrumbItems = [
        { label: 'Inspiração', link: 'Manager.Lojas.Projetos.index' },
        // { label: 'Projects', link: 'Home.index' },
    ];
    
    const contentProjects = {
        nome: ['Projetos', 'projeto'],
        controller: 'Lojas.Projetos',
        imagens: true,
        imgClass: '',
        editavel: true,
        conteudos: projetos
    };
    
    return (
        <AdminLayout>
            <Breadcrumb icon={faDoorOpen} items={breadcrumbItems} current="Projetos de Lojas" idioma={idioma.codigo} idiomas={idiomas} />
            <PageSettings page={pagina} idioma={idioma.codigo} />

            <FormContent content={conteudos[0]} full={true} idioma={idioma.codigo} />

            <FormContent content={conteudos[1]} full={true} idioma={idioma.codigo} />

            <BlockContent content={contentProjects} />
            
        </AdminLayout>
    );
};

export default Page;
