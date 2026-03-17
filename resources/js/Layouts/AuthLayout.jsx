import React from 'react';
import { Head } from '@inertiajs/react';

const AuthLayout = ({ children }) => {
    
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0, shrink-to-fit=no"/>
                <meta charset="utf-8"/>
                <title>Dell Anno | Acesso</title>
                <meta name="robots" content="noindex, nofollow"/>
            </Head>
            
            {children}
            
        </>
    );
};

export default AuthLayout;