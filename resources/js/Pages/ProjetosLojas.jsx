import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { StoresProjectsBanner } from '@/Components/StoresProjectsBanner';
import { StoresProjectsList } from '@/Components/StoresProjectsList';
import StoresProjectsLoadMore from '@/Components/StoresProjectsLoadMore';

const Page = () => {
    const { conteudos, projetos: initialProjects } = usePage().props;
    
    return (
        <DefaultLayout>
            <StoresProjectsBanner content={conteudos[0]}  />

            <StoresProjectsLoadMore
                initialData={initialProjects}
                endMessage="end of results"
                rootMargin="200px"
            >
                {({ data, loading, hasMore }) => (
                    <StoresProjectsList
                        content={conteudos[1]}
                        data={data?.data || []}
                        loading={loading}
                        hasMore={hasMore}
                    />
                )}
            </StoresProjectsLoadMore>
        </DefaultLayout>
    );
};

export default Page;
