import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { FairsBanner } from '@/Components/FairsBanner';
import { FairsList } from '@/Components/FairsList';

const Page = () => {
    const { conteudos, mostras } = usePage().props;
    
    return (
        <DefaultLayout>
            <FairsBanner content={conteudos[0]}  />

            <FairsList
                content={conteudos[1]}
                fairs={mostras}
            />
        </DefaultLayout>
    );
};

export default Page;
