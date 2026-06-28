import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/breadcrumb-comp'
import type { Metadata } from 'next'
import ApiKeys from '@/components/dashboard/theme-pages/api-keys/apikeys-compo'




export const metadata: Metadata = {
    title: 'API Keys',
    description: 'View and manage your API keys.',
}


const BCrumb = [
    {
        to: '/',
        title: 'Dashboard',
    },
    {

        title: 'API Keys',
    },
]

function APIKey() {
    return (
        <>
            <BreadcrumbComp title='API Keys' items={BCrumb} />
            <ApiKeys />
        </>
    )
}

export default APIKey