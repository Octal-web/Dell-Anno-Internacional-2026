import { Link } from '@inertiajs/react';

import { FairItem } from './FairItem';

export const FairYearItems = ({ cities }) => {
    return (
        <>
            {cities.map((city, index) => (
                <FairItem city={city} key={index} isReverse={index % 2 !== 0}  />
            ))}

            <Link href={route('Mostras.index')} className="block w-fit mx-auto mt-16 2xl:mt-20 mb-24 md:mb-30 2xl:mb-36 border border-neutral-800 bg-white font-light text-center uppercase p-2 min-w-60 transition-all hover:bg-black hover:text-white">Back to the Fairs Page</Link>
        </>
    );
};