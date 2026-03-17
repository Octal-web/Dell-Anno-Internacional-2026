import React from 'react';
import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { InspirationBanner } from '@/Components/InspirationBanner';
import { InspirationLinks } from '@/Components/InspirationLinks';

const Page = () => {    
    const { conteudos } = usePage().props;

    return (
        <DefaultLayout>
            <InspirationBanner content={conteudos[0]} />

            <InspirationLinks />
        </DefaultLayout>
    );
};

export default Page;
