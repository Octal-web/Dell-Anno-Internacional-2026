import { Link, usePage } from '@inertiajs/react';

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { PageSettings } from '@/Components/Manager/PageSettings';
import { FormContent } from '@/Components/Manager/FormContent';
import { BlockContent } from '@/Components/Manager/BlockContent';

const Page = () => {
    // Content
    const { pagina, conteudos, idioma, idiomas, acontecimentos, etapas } = usePage().props;

    const breadcrumbItems = [
        // { label: 'Home', link: 'Home.index' },
        // { label: 'Projects', link: 'Home.index' },
    ];
    
    const contentTimeline = {
        nome: ['Linha do Tempo', 'acontecimento'],
        controller: 'Acontecimentos',
        imagens: true,
        imgClass: '',
        editavel: true,
        conteudos: acontecimentos
    };
    
    const contentSteps = {
        nome: ['Etapas', 'etapa'],
        controller: 'Etapas',
        imagens: false,
        imgClass: '',
        editavel: true,
        conteudos: etapas
    };

    return (
        <AdminLayout>
            <Breadcrumb icon={faInfoCircle} items={breadcrumbItems} current="Institucional" idioma={idioma.codigo} idiomas={idiomas} />
            <PageSettings page={pagina} idioma={idioma.codigo} />

            <FormContent content={conteudos[0]} full={true} idioma={idioma.codigo} />

            <BlockContent content={contentTimeline} />

            <FormContent content={conteudos[1]} full={true} idioma={idioma.codigo} />

            <FormContent content={conteudos[2]} full={true} toolbar={['List', 'Table', 'Image']} idioma={idioma.codigo} />
            
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-3">
                <FormContent content={conteudos[3]} full={false} idioma={idioma.codigo} />

                <FormContent content={conteudos[4]} full={false} idioma={idioma.codigo} />

                <FormContent content={conteudos[5]} full={false} idioma={idioma.codigo} />
            </div>
            
            <FormContent content={conteudos[6]} full={true} idioma={idioma.codigo} />
            
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
                <FormContent content={conteudos[7]} full={false} idioma={idioma.codigo} />

                <FormContent content={conteudos[8]} full={false} idioma={idioma.codigo} />
            </div>
            
            <FormContent content={conteudos[9]} full={true} toolbar={['List', 'Table', 'Image']} idioma={idioma.codigo} />
            
            <BlockContent content={contentSteps} />
            
        </AdminLayout>
    );
};

export default Page;
