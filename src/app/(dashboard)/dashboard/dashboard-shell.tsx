"use client"

import React, { useContext } from "react"
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
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div
            className={cn(
              isLayout === "full" ? "w-full px-5" : "container mx-auto",
              activeLayout === "horizontal" ? "xl:mt-3" : "",
            )}
          >
            <div className="min-h-[calc(100vh-140px)]">{children}</div>
            <div className="pt-6">
              <Footer />
            </div>
          </div>
          <Customizer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
