import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { CatalogsBanner } from '@/Components/CatalogsBanner';
import { CatalogsList } from '@/Components/CatalogsList';

const Page = () => {
    const { catalogos, conteudos } = usePage().props;

    return (
        <DefaultLayout>
            <CatalogsBanner content={conteudos[0]} />

            <CatalogsList catalogs={catalogos}  />
        </DefaultLayout>
    );
};

export default Page;
