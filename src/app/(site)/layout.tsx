import { ThemeProvider } from 'next-themes'
import Header from '../components/layout/header'
import Footer from '../components/layout/footer'
import SessionProviderComp from '../../providers/SessionProvider'
import ScrollToTop from '../components/scroll-to-top'

export default function SiteLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode
  session?: unknown
}>) {
  return (
    <div className="font-sans bg-white dark:bg-black antialiased">
      <SessionProviderComp session={session}>
        <ThemeProvider attribute="class" enableSystem defaultTheme="light">
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </SessionProviderComp>
    </div>
  )
}
