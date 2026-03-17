import React, { useState, useEffect, useRef, useCallback } from 'react';
import { router } from '@inertiajs/react';

const ShowroomsLoadMore = ({ 
    initialData, 
    onDataUpdate, 
    children, 
    loadingComponent = null,
    endMessage = "Todos os showrooms foram carregados",
    rootMargin = "100px",
    threshold = 0.1 
}) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialData?.next_page_url !== null);
    const observerRef = useRef();

    const loadMore = useCallback(() => {
        if (loading || !hasMore || !data?.next_page_url) return;

        setLoading(true);

        router.visit(data.next_page_url, {
            preserveState: true,
            preserveScroll: true,
            replace: false,
            only: ['showrooms'],
            onSuccess: (page) => {
                const newData = page.props.showrooms;
                
                const updatedData = {
                    ...newData,
                    data: [...data.data, ...newData.data]
                };
                
                setData(updatedData);
                setHasMore(newData.next_page_url !== null);
                setLoading(false);
                
                if (onDataUpdate) {
                    onDataUpdate(updatedData);
                }
            },
            onError: (errors) => {
                console.error('Erro ao carregar mais dados:', errors);
                setLoading(false);
            }
        });
    }, [loading, hasMore, data, onDataUpdate]);

    const triggerRef = useCallback((node) => {
        if (loading) return;
        if (observerRef.current) observerRef.current.disconnect();
        
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMore();
            }
        }, {
            rootMargin,
            threshold
        });
        
        if (node) observerRef.current.observe(node);
    }, [loading, hasMore, loadMore, rootMargin, threshold]);

    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        setData(initialData);
        setHasMore(initialData?.next_page_url !== null);
    }, [initialData]);

    const defaultLoadingComponent = (
        <div className="flex justify-center items-center pb-16">
            <div className="flex items-center">
                <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );

    return (
        <div>
            {children({ data, loading, hasMore, loadMore })}
            
            {hasMore && (
                <div ref={triggerRef} className="h-4" />
            )}
            
            {loading && (loadingComponent || defaultLoadingComponent)}
            
            {!hasMore && data?.data?.length > 0 && (
                <div className="text-center pb-16 text-gray-400">
                    {endMessage}
                </div>
            )}
        </div>
    );
};

export default ShowroomsLoadMore;