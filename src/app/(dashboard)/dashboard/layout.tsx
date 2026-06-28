"use client";
import React, { useContext } from "react";
import Header from "./layout/vertical/header";
import { Customizer } from "./layout/shared/customizer";
import { CustomizerContext } from "@/app/context/customizer-context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Footer from "./layout/footer/page";
import { AppSidebar } from "./layout/vertical/sidebar/app-sidebar";
import { cn } from "@/lib/utils";
import HorizontalHeader from "./layout/horizontal/header";
import "@/utils/i18n";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { activeLayout, isLayout, isCollapse } = useContext(CustomizerContext);

  return (
    <SidebarProvider
      defaultOpen={!isCollapse}
      style={{ "--sidebar-width-icon": "42px" } as React.CSSProperties}
    >
      {activeLayout == "vertical" ? (
        <AppSidebar />
      ) : (
        <div className="lg:hidden block">
          <AppSidebar />
        </div>
      )}
      <SidebarInset className="outline outline-border m-2 rounded-xl overflow-hidden">
        {/* Top Header  */}
        {activeLayout == "vertical" ? <Header /> : <HorizontalHeader />}
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Body Content  */}
          <div
            className={cn(
              isLayout === "full" ? "w-full px-5" : "container mx-auto",
              activeLayout === "horizontal" ? "xl:mt-3" : ""
            )}
          >
            <div className="min-h-[calc(100vh-140px)] ">{children}</div>
            <div className="pt-6">
              <Footer />
            </div>
          </div>
          <Customizer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

