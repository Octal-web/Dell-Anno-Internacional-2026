import React from 'react';
import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { HomeSlides } from '@/Components/HomeSlides';
import { HomeCampaigns } from '@/Components/HomeCampaigns';
import { HomeHighlights } from '@/Components/HomeHighlights';
import { HomeProducts } from '@/Components/HomeProducts';
import { HomePosts } from '@/Components/HomePosts';

const Page = () => {
    const { slides, campanhas, destaques, produtos, posts, conteudos } = usePage().props;
    
    return (
        <DefaultLayout>
            <HomeSlides slides={slides} />

            <HomeCampaigns campaigns={campanhas} />

            <HomeHighlights highlights={destaques.slice(0, 2)} />

            <HomeHighlights highlights={destaques.slice(2)} />

            <HomeProducts content={conteudos[0]} products={produtos} />

            <HomePosts content={conteudos[1]} posts={posts} />
        </DefaultLayout>
    );
};

export default Page;
