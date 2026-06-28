

import * as React from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import FullLogo from "../../shared/logo/full-logo";
import sidebaritems from "./sidebaritems";
import NavCollapse from "./nav-collapse";
import { CustomizerContext } from "@/app/context/customizer-context";
import { useContext } from "react";
import SimpleBar from "simplebar-react";
import { NavSecondary } from "./nav-secondary"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const { activeDir, isCollapse } = useContext(CustomizerContext)
    return (


        <Sidebar
            variant="inset"
            collapsible="icon"
            {...props}
            className="sidebar-box"
            side={activeDir === "rtl" ? "right" : "left"}
        >

            <SidebarHeader className="p-4 group-data-[state=collapsed]:px-2.5">
                <FullLogo />
            </SidebarHeader>

            <SidebarContent>
                <SimpleBar style={{ height: "100%" }} >
                    <SidebarGroup className="flex items-center justify-center">
                        <div className="px-2 group-data-[state=collapsed]:px-0 w-full">
                            <NavCollapse menu={sidebaritems} className="text-sm" />
                        </div>
                    </SidebarGroup>
                </SimpleBar>
            </SidebarContent>

            <SidebarFooter className="p-4">
                {/* <BuyNowCard /> */}
                <div className="hide-menu flex flex-col gap-2">
                    <NavSecondary />
                    {/* <NavUser /> */}
                </div>
            </SidebarFooter>

        </Sidebar >

    );
}
