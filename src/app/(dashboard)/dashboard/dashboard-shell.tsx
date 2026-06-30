"use client"

import React, { useContext } from "react"
import { usePathname } from "next/navigation"
import Header from "./layout/vertical/header"
import { Customizer } from "./layout/shared/customizer"
import { CustomizerContext } from "@/app/context/customizer-context"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import Footer from "./layout/footer/page"
import { AppSidebar } from "./layout/vertical/sidebar/app-sidebar"
import { cn } from "@/lib/utils"
import HorizontalHeader from "./layout/horizontal/header"
import type { MenuItem } from "./layout/vertical/sidebar/sidebaritems"
import type { AuthUser } from "@/lib/auth/session"
import "@/utils/i18n"

interface DashboardShellProps {
  children: React.ReactNode
  navigation: MenuItem[]
  user: AuthUser
}

export default function DashboardShell({
  children,
  navigation,
  user,
}: DashboardShellProps) {
  const { activeLayout, isLayout, isCollapse } = useContext(CustomizerContext)
  const pathname = usePathname()
  const isFullWidthRoute = pathname === "/dashboard/buy"

  return (
    <SidebarProvider
      defaultOpen={!isCollapse}
      style={{ "--sidebar-width-icon": "42px" } as React.CSSProperties}
    >
      {activeLayout == "vertical" ? (
        <AppSidebar navigation={navigation} user={user} />
      ) : (
        <div className="lg:hidden block">
          <AppSidebar navigation={navigation} user={user} />
        </div>
      )}
      <SidebarInset className="outline outline-border m-2 rounded-xl overflow-hidden">
        {activeLayout == "vertical" ? (
          <Header user={user} />
        ) : (
          <HorizontalHeader user={user} />
        )}
        <div className={cn("flex flex-1 flex-col gap-4", isFullWidthRoute ? "p-0" : "p-4")}>
          <div
            className={cn(
              isLayout === "full" || isFullWidthRoute ? "w-full" : "container mx-auto",
              isFullWidthRoute && "px-0",
              activeLayout === "horizontal" ? "xl:mt-3" : "",
            )}
          >
            <div className={cn("min-h-[calc(100vh-140px)]", isFullWidthRoute && "min-h-[calc(100vh-120px)]")}>
              {children}
            </div>
            {!isFullWidthRoute ? (
              <div className="pt-6">
                <Footer />
              </div>
            ) : null}
          </div>
          <Customizer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
