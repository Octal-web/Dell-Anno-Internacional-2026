import React from 'react';
import { Link, usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { ShowroomBanner } from '@/Components/ShowroomBanner';
import { ShowroomGrid } from '@/Components/ShowroomGrid';
import { OtherShowroomsList } from '@/Components/OtherShowroomsList';

const Page = () => {
    const { showroom, todosShowrooms } = usePage().props;
    return (
        <DefaultLayout>
            <ShowroomBanner showroom={showroom} />

            {showroom.imagens.length && <ShowroomGrid showroom={showroom} /> }

            <OtherShowroomsList showrooms={todosShowrooms} />
        </DefaultLayout>
    );
};

export default Page;
