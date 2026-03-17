import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { FairYearBanner } from '@/Components/FairYearBanner';
import { FairYearYears } from '@/Components/FairYearYears';
import { FairYearItems } from '@/Components/FairYearItems';

const Page = () => {
    const { ano, todosAnos } = usePage().props;
    
    return (
        <DefaultLayout>
            <FairYearBanner data={ano} />

            <FairYearYears slides={todosAnos} currentYear={ano.ano} />

            <FairYearItems cities={ano.cidades} />
        </DefaultLayout>
    );
};

export default Page;
