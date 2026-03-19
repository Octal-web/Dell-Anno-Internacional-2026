import React from 'react';
import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { StoreBanner } from '@/Components/StoreBanner';
import { StoreData } from '@/Components/StoreData';
import { StoreStreetView } from '@/Components/StoreStreetView';
import { StoreBrandItems } from '@/Components/StoreBrandItems';
import { StoreShowroomImage } from '@/Components/StoreShowroomImage';
import { StoreFeatureds } from '@/Components/StoreFeatureds';
// import { StoreProjects } from '@/Components/StoreProjects';
import { ProjectSteps } from '@/Components/ProjectSteps';
import { ProductsForm } from '@/Components/ProductsForm';
import { StoreProjectGrid } from '@/Components/StoreProjectGrid';

const Page = () => {
    const { loja, conteudos, imagensShowroom, fasesProjetos, chamadaForm } = usePage().props;
    
    return (
        <DefaultLayout>
            <StoreBanner store={loja} />
            
            <StoreData store={loja} />

            {loja.link_showroom && <StoreStreetView link={loja.link_showroom} />}
            
            <StoreBrandItems content={conteudos[0]} />
            
            <StoreShowroomImage image={loja.imagem_showroom} />
            
            {imagensShowroom.length && <StoreFeatureds images={imagensShowroom} /> }

            {loja.projetos.length && <StoreProjectGrid projects={loja.projetos} /> }
            
            {/* imagensProjetos.length && <StoreProjects images={imagensProjetos} /> */}

            <ProjectSteps content={conteudos[1]} steps={fasesProjetos} noExternal={false} />

            <ProductsForm content={chamadaForm} />
        </DefaultLayout>
    );
};

export default Page;
