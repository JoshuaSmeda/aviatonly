"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { useSignOut } from "@/components/dashboard/auth/use-sign-out"

interface SignOutButtonProps {
  variant?: "default" | "outline" | "ghost"
  className?: string
  fullWidth?: boolean
}

export function SignOutButton({
  variant = "outline",
  className,
  fullWidth,
}: SignOutButtonProps) {
  const { signOutUser, isPending } = useSignOut()

  return (
    <Button
      variant={variant}
      className={cn(fullWidth && "w-full", className)}
      disabled={isPending}
      onClick={signOutUser}
    >
      {isPending ? <Spinner data-icon="inline-start" /> : <LogOut data-icon="inline-start" />}
      {isPending ? "Signing out..." : "Log out"}
    </Button>
  )
}
