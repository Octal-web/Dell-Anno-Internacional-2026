import React from 'react';
import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { AboutVideo } from '@/Components/AboutVideo';
import { AboutTimeline } from '@/Components/AboutTimeline';
import { AboutOrigin } from '@/Components/AboutOrigin';
import { AboutTradition } from '@/Components/AboutTradition';
import { AboutItems } from '@/Components/AboutItems';
import { AboutPainting } from '@/Components/AboutPainting';
import { AboutSustain } from '@/Components/AboutSustain';
import { AboutPractices } from '@/Components/AboutPractices';
import { AboutSteps } from '@/Components/AboutSteps';

const Page = () => {
    const { acontecimentos, etapas, imagensGaleria, conteudos } = usePage().props;
    
    return (
        <DefaultLayout>
            <AboutVideo content={conteudos[0]} />
            
            <AboutTimeline slides={acontecimentos} />
            
            <AboutOrigin content={conteudos[1]} images={imagensGaleria[conteudos[1].id]} />

            <AboutTradition content={conteudos[2]} />

            <AboutItems items={[conteudos[3], conteudos[4], conteudos[5]]} />
            
            <AboutPainting content={conteudos[6]} />

            <AboutSustain firstContent={conteudos[7]} secondContent={conteudos[8]} />

            <AboutPractices content={conteudos[9]} />

            <AboutSteps steps={etapas} />
        </DefaultLayout>
    );
};

export default Page;
