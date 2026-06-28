import React from "react";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { CustomizerContextProvider } from '@/app/context/customizer-context'
import { ThemeProvider } from '@/components/Themeprovider'
import '@/utils/i18n'
import { Geist } from "next/font/google";
import "@/app/dashboard-globals.css"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});


export const metadata: Metadata = {
  title: "ShadcnSpace Dashboard - Tailwind + Shadcn Nextjs",
  description: "Modern admin dashboard built with Next.js, Tailwind, and Shadcn.",

  openGraph: {
    title: "ShadcnSpace Dashboard",
    description: "Modern admin dashboard built with Next.js, Tailwind, and Shadcn.",
    url: "https://dashboard.shadcnspace.com/",
    siteName: "ShadcnSpace Dashboard",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "ShadcnSpace Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ShadcnSpace Dashboard",
    description: "Modern admin dashboard built with Next.js, Tailwind, and Shadcn.",
    images: ["/og-image.webp"], // same image
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/svg+xml" />
      </head>
      <body className={`${geist.className} `} >
        <NextTopLoader color="var(--primary)" showSpinner={false} />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CustomizerContextProvider>{children}</CustomizerContextProvider>

        </ThemeProvider>
      </body>
    </html>
  );
}