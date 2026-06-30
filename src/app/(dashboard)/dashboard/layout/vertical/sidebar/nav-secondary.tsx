"use client"
import * as React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { AuthUser } from "@/lib/auth/session"

interface NavSecondaryProps {
  user: AuthUser | null
}

export function NavSecondary({ user }: NavSecondaryProps) {
    if (!user) {
        return (
            <Card className="shadow-none ring-0 bg-primary/5 px-4 py-6 border-none">
                <CardContent className="p-0 flex flex-col gap-3 items-center">
                    <div className="flex flex-col gap-1 text-center">
                        <p className="text-base font-semibold text-card-foreground">
                            AVIATONLY
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Sign in to sell aircraft, make offers, or manage your account.
                        </p>
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        <Button render={<Link href="/auth/auth1/login" />} className="w-full">
                            Sign in
                        </Button>
                        <Button variant="outline" render={<Link href="/auth/auth1/register" />} className="w-full">
                            Create account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

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
                                AVIATONLY
                            </p>
                            <p className="text-sm font-regular text-muted-foreground text-center">
                                Signed in as {user.name ?? user.email}
                            </p>
                        </div>
                        <Link href="/dashboard/settings" className="w-fit px-4 py-2 shadow-none cursor-pointer rounded-lg bg-gray-950 dark:bg-white hover:bg-gray-950/80 hover:dark:bg-white/80 font-medium hover:bg text-white dark:text-gray-950 h-9">
                            Account settings
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
