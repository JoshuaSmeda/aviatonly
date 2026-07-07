"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import { signOut } from "@/lib/auth-client"

export function useSignOut() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const signOutUser = () => {
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

  return { signOutUser, isPending }
}
