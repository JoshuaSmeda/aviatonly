import '../dashboard-globals.css'
import '@/utils/i18n'
import { CustomizerContextProvider } from '@/app/context/customizer-context'
import { ThemeProvider } from '@/components/Themeprovider'

export default function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="font-sans">
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <CustomizerContextProvider>{children}</CustomizerContextProvider>
      </ThemeProvider>
    </div>
  )
}
