import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { StoreProjectBanner } from '@/Components/StoreProjectBanner';
import { StoreProjectStats } from '@/Components/StoreProjectStats';
import { StoreProjectDetails } from '@/Components/StoreProjectDetails';
import { StoreProjectGallery } from '@/Components/StoreProjectGallery';
import { OtherStoreProjectsList } from '@/Components/OtherStoreProjectsList';
import { ProductsForm } from '@/Components/ProductsForm';

const Page = () => {
    const { conteudos, projeto, todosProjetos } = usePage().props;
    
    return (
        <DefaultLayout>
            <StoreProjectBanner project={projeto} />
            
            <StoreProjectStats project={projeto} />
            
            <StoreProjectDetails data={projeto.conteudo} />
            
            <StoreProjectGallery slides={projeto.imagens} />

            <OtherStoreProjectsList projects={todosProjetos} />

            <ProductsForm content={conteudos[0]} />       
        </DefaultLayout>
    );
};

export default Page;
