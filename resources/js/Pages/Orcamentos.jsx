import React from 'react';
import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { ProjectSteps } from '@/Components/ProjectSteps';
import { ProductsForm } from '@/Components/ProductsForm';

const Page = () => {
    const { chamadaFases, fasesProjetos, chamadaForm } = usePage().props;
    
    return (
        <DefaultLayout>
            <ProjectSteps content={chamadaFases} steps={fasesProjetos} noExternal={true} />

            <ProductsForm content={chamadaForm} />
        </DefaultLayout>
    );
};

export default Page;
