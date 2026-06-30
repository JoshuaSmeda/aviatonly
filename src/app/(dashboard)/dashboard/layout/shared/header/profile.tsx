"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext, useTransition } from "react"
import { LogOut, Mail } from "lucide-react"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetFooter,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { CustomizerContext } from "@/app/context/customizer-context"
import { profileDD } from "@/app/(dashboard)/dashboard/layout/shared/header/data"
import { cn, withDashboardBase } from "@/lib/utils"
import { signOut } from "@/lib/auth-client"
import { toast } from "sonner"
import type { AuthUser } from "@/lib/auth/session"
import { getUserInitials } from "@/lib/auth/roles"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

interface ProfileSheetProps {
  user: AuthUser | null
}

export default function ProfileSheet({ user }: ProfileSheetProps) {
  const { activeDir } = useContext(CustomizerContext)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

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

  const handleSignOut = () => {
    startTransition(async () => {
      const result = await signOut()
      if (result.error) {
        toast.error(result.error.message ?? "Could not sign out.")
        return
      }
      router.push("/auth/auth1/login")
      router.refresh()
    })
  }

  return (
    <Sheet>
      <SheetTrigger className="cursor-pointer hover:bg-primary/5 flex items-center justify-center rounded-full size-10">
        <Avatar className="size-8">
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? "profile"} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </SheetTrigger>

      <SheetContent
        showCloseButton={false}
        side={activeDir === "rtl" ? "left" : "right"}
        className="border-s-0 w-full sm:max-w-80"
      >
        <SheetClose className="absolute top-5 end-5 p-2 hover:bg-primary/15 hover:text-primary rounded-full">
          <Icon icon="tabler:x" width={20} height={20} />
        </SheetClose>

        <SheetHeader className="items-center pt-10 text-center">
          <Avatar className="size-16">
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name ?? "Profile"}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <SheetTitle>{user.name ?? "AVIATONLY user"}</SheetTitle>
          <SheetDescription className="flex items-center justify-center gap-2">
            <Mail className="text-muted-foreground" />
            {user.email}
          </SheetDescription>
          <div className="flex flex-wrap justify-center gap-1 pt-1">
            {user.roles.map((role) => (
              <Badge key={role} variant="secondary">
                {role}
              </Badge>
            ))}
          </div>
        </SheetHeader>

        <Separator className="my-4" />

        <nav className="flex flex-col gap-1 px-2">
          {profileDD.map((item) => (
            <Link
              key={item.title}
              href={withDashboardBase(item.href)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-primary/5 hover:text-primary",
              )}
            >
              <Icon icon={item.avatar} width={20} height={20} />
              <span className="flex-1">{item.title}</span>
              {item.badge ? (
                <Badge variant="outline" className="tabular-nums">
                  4
                </Badge>
              ) : null}
            </Link>
          ))}
        </nav>

        <SheetFooter className="mt-auto px-2 pb-2">
          <Button
            variant="outline"
            className="w-full"
            disabled={isPending}
            onClick={handleSignOut}
          >
            {isPending ? <Spinner data-icon="inline-start" /> : <LogOut data-icon="inline-start" />}
            {isPending ? "Signing out..." : "Log out"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
