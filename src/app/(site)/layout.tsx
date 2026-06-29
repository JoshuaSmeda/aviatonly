import { ThemeProvider } from 'next-themes'
import Header from '../components/layout/header'
import Footer from '../components/layout/footer'
import ScrollToTop from '../components/scroll-to-top'

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="site-layout font-sans bg-white dark:bg-black antialiased">
      <ThemeProvider attribute="class" enableSystem defaultTheme="light">
        <Header />
        {children}
        <Footer />
        <ScrollToTop />
      </ThemeProvider>
    </div>
  )
}
