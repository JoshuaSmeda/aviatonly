"use client"
import * as React from "react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Settings, CircleQuestionMark } from 'lucide-react';
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function NavSecondary() {


    const navSecondary = [
        {
            title: "Settings",
            url: "/theme-pages/account-settings",
            icon: Settings,
        },
        {
            title: "Get Help",
            url: "/theme-pages/faq",
            icon: CircleQuestionMark,
        },
    ]

    return (
        <div>
            <Card className="shadow-none ring-0 bg-primary/5 px-4 py-6 border-none">
                <CardContent className="p-0 flex flex-col gap-3 items-center">
                    <img
                        src="https://images.shadcnspace.com/assets/backgrounds/download-img.png"
                        alt="sidebar-img"
                        width={74}
                        height={74}
                        className="h-20 w-20"
                    />
                    <div className="flex flex-col gap-4 items-center">
                        <div>
                            <p className="text-base font-semibold text-card-foreground text-center">
                                Grab Pro Now
                            </p>
                            <p className="text-sm font-regular text-muted-foreground text-center">
                                Customize your admin
                            </p>
                        </div>
                        <Link target="_blank" href={"https://shadcnspace.com/admin-dashboard"} className="w-fit px-4 py-2 shadow-none cursor-pointer rounded-lg bg-gray-950 dark:bg-white hover:bg-gray-950/80 hover:dark:bg-white/80 font-medium hover:bg text-white dark:text-gray-950 h-9">
                            Get Premium
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}