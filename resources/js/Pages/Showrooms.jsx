import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { ShowroomsBanner } from '@/Components/ShowroomsBanner';
import { ShowroomsList } from '@/Components/ShowroomsList';
import ShowroomsLoadMore from '@/Components/ShowroomsLoadMore';

const Page = () => {
    const { conteudos, showrooms: initialShowrooms } = usePage().props;
    
    return (
        <DefaultLayout>
            <ShowroomsBanner content={conteudos[0]}  />

            <ShowroomsLoadMore
                initialData={initialShowrooms}
                endMessage="end of results"
                rootMargin="200px"
            >
                {({ data, loading, hasMore }) => (
                    <ShowroomsList
                        content={conteudos[1]}
                        data={data?.data || []}
                        loading={loading}
                        hasMore={hasMore}
                    />
                )}
            </ShowroomsLoadMore>
        </DefaultLayout>
    );
};

export default Page;
