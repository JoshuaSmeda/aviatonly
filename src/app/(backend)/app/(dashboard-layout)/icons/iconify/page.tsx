import { Metadata } from 'next'


import BreadcrumbComp from '../../layout/shared/breadcrumb/breadcrumb-comp'
import IconifyIcon from '@/app/components/icons/iconify-icons'

export const metadata: Metadata = {
  title: 'Iconify Tabler Icons',
}

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Iconify Icons',
  },
]

const page = () => {
  return (
    <>
      <BreadcrumbComp title='Iconify Icons' items={BCrumb} />
      <IconifyIcon />
    </>
  )
}

export default page
