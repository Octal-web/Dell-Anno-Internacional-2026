import React from 'react';
import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { FinishesBanner } from '@/Components/FinishesBanner';
import { FinishesContent } from '@/Components/FinishesContent';
import { OtherFinishesList } from '@/Components/OtherFinishesList';

const Page = () => {
    const { acabamento, todosAcabamentos, conteudos } = usePage().props;
    
    return (
        <DefaultLayout>
            <FinishesBanner current={acabamento.slug} content={conteudos[0]} finishes={todosAcabamentos} />

            <FinishesContent blocks={acabamento.blocos} />
            
            <OtherFinishesList finishes={todosAcabamentos.slice(0, 4)} />
        </DefaultLayout>
    );
};

export default Page;
