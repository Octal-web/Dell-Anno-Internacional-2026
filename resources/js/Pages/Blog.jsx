import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { BlogBanner } from '@/Components/BlogBanner';
import { BlogPostsList } from '@/Components/BlogPostsList';
import BlogPostsLoadMore from '@/Components/BlogPostsLoadMore';

const Page = () => {
    const { conteudos, postsCategorias, posts: initialPosts } = usePage().props;
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredPosts, setFilteredPosts] = useState(initialPosts);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFromUrl = urlParams.get('categoria');
        
        if (categoryFromUrl) {
            const category = postsCategorias.find(cat => cat.slug === categoryFromUrl);
            if (category) {
                setSelectedCategory(category);
            }
        }
    }, [postsCategorias]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        
        const params = category ? { categoria: category.slug } : {};
        
        router.visit(window.location.pathname, {
            data: params,
            preserveState: false,
            preserveScroll: true,
            replace: true,
            onSuccess: (page) => {
                setFilteredPosts(page.props.posts);
            }
        });
    };

    return (
        <DefaultLayout>
            <BlogBanner 
                content={conteudos[0]} 
                categories={postsCategorias}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
            />

            <BlogPostsLoadMore
                initialData={filteredPosts}
                selectedCategory={selectedCategory}
                endMessage="end of results"
                rootMargin="200px"
            >
                {({ data, loading, hasMore }) => (
                    <BlogPostsList
                        data={data?.data || []}
                        loading={loading}
                        hasMore={hasMore}
                    />
                )}
            </BlogPostsLoadMore>
        </DefaultLayout>
    );
};

export default Page;