import React from 'react';
import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { PostBanner } from '@/Components/PostBanner';
import { PostContent } from '@/Components/PostContent';
import { OtherPostsList } from '@/Components/OtherPostsList';

const Page = () => {
    const { post, posts } = usePage().props;
    
    return (
        <DefaultLayout>
            <PostBanner post={post} />

            <PostContent post={post} />

            <OtherPostsList posts={posts} />
        </DefaultLayout>
    );
};

export default Page;
