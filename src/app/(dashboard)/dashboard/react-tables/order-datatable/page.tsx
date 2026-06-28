

import { Metadata } from 'next'
import BreadcrumbComp from '../../layout/shared/breadcrumb/breadcrumb-comp'
import OrderTable from '@/components/dashboard/react-tables/order-datatable/page'

export const metadata: Metadata = {
  title: 'Order Table',
}

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '',
    title: 'Order Table',
  },
]

function page() {
  return (
    <>
      <BreadcrumbComp title='Order Table' items={BCrumb} />
      <OrderTable />
    </>
  )
}

export default page;
