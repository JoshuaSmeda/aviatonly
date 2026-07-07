"use client"

import Link from "next/link"
import { LogOut, Mail, Settings } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn, withDashboardBase } from "@/lib/utils"
import type { AuthUser } from "@/lib/auth/session"
import { getUserInitials } from "@/lib/auth/roles"
import { Badge } from "@/components/ui/badge"
import { useSignOut } from "@/components/dashboard/auth/use-sign-out"

interface ProfileSheetProps {
  user: AuthUser | null
}

export default function ProfileSheet({ user }: ProfileSheetProps) {
  const { signOutUser, isPending } = useSignOut()

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" render={<Link href="/auth/auth1/login" />}>
          Sign in
        </Button>
        <Button size="sm" render={<Link href="/auth/auth1/register" />}>
          Register
        </Button>
      </div>
    )
  }

  const initials = getUserInitials(user.name, user.email)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "cursor-pointer hover:bg-primary/5 flex items-center justify-center rounded-full size-10 outline-none",
        )}
      >
        <Avatar className="size-8">
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? "profile"} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex flex-col gap-2 px-2 py-2">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage
                    src={user.image ?? undefined}
                    alt={user.name ?? "Profile"}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {user.name ?? "AVIATONLY user"}
                  </p>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <Mail className="size-3 shrink-0" />
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {user.roles.map((role) => (
                  <Badge key={role} variant="secondary" className="text-xs">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link href={withDashboardBase("/settings")} />}>
          <Settings />
          Account settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          onClick={signOutUser}
        >
          <LogOut />
          {isPending ? "Signing out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
