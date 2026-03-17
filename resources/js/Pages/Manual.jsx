import React from 'react';
import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { ManualText } from '@/Components/ManualText';

const Page = () => {
    const { texto, arquivo } = usePage().props;

    return (
        <DefaultLayout>
            <ManualText content={texto} file={arquivo} />
        </DefaultLayout>
    );
};

export default Page;