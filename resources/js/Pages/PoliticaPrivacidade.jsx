import React from 'react';
import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { PolicyText } from '@/Components/PolicyText';

const Page = () => {
    const { conteudos } = usePage().props;

    return (
        <DefaultLayout>
            <PolicyText content={conteudos[0]} />
        </DefaultLayout>
    );
};

export default Page;