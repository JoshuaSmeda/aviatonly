import type { Metadata } from 'next'
import './globals.css'
import NextTopLoader from 'nextjs-toploader'

export const metadata: Metadata = {
  title: {
    default: 'AVIATONLY',
    template: '%s | AVIATONLY',
  },
  description:
    'South African aviation marketplace for buying and selling aircraft.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextTopLoader color="#07be8a" showSpinner={false} />
        {children}
      </body>
    </html>
  )
}
