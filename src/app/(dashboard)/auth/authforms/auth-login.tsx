"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import { signIn } from "@/lib/auth-client"
import { DASHBOARD_BASE_PATH } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

const AuthLogin = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const email = form.email.value.trim()
    const password = form.password.value.trim()

    if (!email || !password) {
      toast.error("Please fill in all fields.")
      return
    }

    startTransition(async () => {
      const result = await signIn.email({
        email,
        password,
        rememberMe: form.remember?.checked ?? false,
      })

      if (result.error) {
        toast.error(result.error.message ?? "Invalid email or password.")
        return
      }

      const callbackUrl = searchParams.get("callbackUrl") ?? DASHBOARD_BASE_PATH
      router.push(callbackUrl)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Enter your password"
          />
        </Field>
        <Field orientation="horizontal" className="justify-between">
          <Field orientation="horizontal" className="w-auto items-center">
            <Checkbox id="remember" name="remember" />
            <FieldLabel htmlFor="remember" className="font-normal">
              Remember this device
            </FieldLabel>
          </Field>
          <Button
            variant="link"
            size="sm"
            className="h-auto px-0"
            render={<Link href="/auth/auth1/forgot-password" />}
          >
            Forgot password?
          </Button>
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}

export default AuthLogin
