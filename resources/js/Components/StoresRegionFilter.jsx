import React from 'react';

export const StoresRegionFilter = ({ regions, selectedRegion, setSelectedRegion, onRegionChange }) => {
    const handleRegionClick = (region) => {
        
        const currentParams = new URLSearchParams(window.location.search);
        
        currentParams.set('region', region);
        setSelectedRegion(region);
        
        const newUrl = window.location.pathname + (currentParams.toString() ? '?' + currentParams.toString() : '');
        
        onRegionChange(newUrl);
    };

    return (
        <section className="md:my-10">
            <div className="container max-w-x-large">
                <div className="flex items-center justify-center gap-4 md:gap-10 border-b">
                    
                    {regions.map((region, index) => (
                        <button
                            key={index}
                            onClick={() => handleRegionClick(region.slug)}
                            className={`relative px-2 sm:px-10 md:px-16 py-6 md:py-8 text-xl sm:text-2xl font-light uppercase transition-all hover:text-neutral-800 after:absolute after:-bottom-px after:left-0 after:right-0 after:h-px  after:transition-all ${
                                (selectedRegion === region.slug) || (!selectedRegion && index === 0)
                                    ? 'text-black font-medium after:h-2 after:bg-black'
                                    : 'text-neutral-600 after:bg-opacity-0 after:bg-neutral-400 hover:after:bg-opacity-100'
                            }`}
                        >
                            {region.nome}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};