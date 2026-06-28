
import type { Metadata } from 'next'
import BreadcrumbComp from '../../layout/shared/breadcrumb/breadcrumb-comp'
import Integartionpage from '@/app/components/theme-pages/integration/integartion-page'

export const metadata: Metadata = {
    title: 'Integration',
    description: 'View and manage app integrations.',
}


const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {

        title: 'Integration',
    },
]


function Integration() {
    return (
        <>
            <BreadcrumbComp title='Integration' items={BCrumb} />
            <Integartionpage />
        </>
    )
}

export default Integration