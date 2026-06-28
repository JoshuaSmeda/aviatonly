'use client'

import Image from 'next/image'
import Link from 'next/link'
const FullLogo = () => {
  return (

    <Link href={'/'} className="max-w-[40px] block lg:max-w-[147px] overflow-hidden">
      {/* Dark Logo   */}
      <Image
        src={'/images/logos/darklogo.svg'}
        alt='logo'
        width={147}
        height={40}
        className='block dark:hidden max-w-[147px] rtl:scale-x-[-1]'
      />
      {/* Light Logo  */}
      <Image
        src={'/images/logos/whitelogo.svg'}
        alt='logo'
        width={147}
        height={40}
        className='hidden dark:block max-w-[147px] rtl:scale-x-[-1]'
      />
    </Link>

  )
}

export default FullLogo
