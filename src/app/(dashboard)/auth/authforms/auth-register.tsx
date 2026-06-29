"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import { signUp } from "@/lib/auth-client"
import { DASHBOARD_BASE_PATH } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

const AuthRegister = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name")?.toString().trim()
    const email = formData.get("email")?.toString().trim()
    const password = formData.get("password")?.toString().trim()

    if (!name || !email || !password) {
      toast.error("Please fill in all fields.")
      return
    }

    startTransition(async () => {
      const result = await signUp.email({
        name,
        email,
        password,
      })

      if (result.error) {
        toast.error(result.error.message ?? "Could not create your account.")
        return
      }

      toast.success("Account created. Welcome to AVIATONLY.")
      router.push(DASHBOARD_BASE_PATH)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
          <FieldDescription>
            A default seller organization is created when you register.
          </FieldDescription>
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        {isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}

export default AuthRegister
