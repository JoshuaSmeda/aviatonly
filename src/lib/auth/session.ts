import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth, type Session } from "@/lib/auth"
import {
  type AppRole,
  parseRoles,
  hasAnyRole,
} from "@/lib/auth/roles"

export type AuthUser = Session["user"] & {
  roles: AppRole[]
}

export type AuthSession = Omit<Session, "user"> & {
  user: AuthUser
}

function enrichSession(session: Session): AuthSession {
  return {
    ...session,
    user: {
      ...session.user,
      roles: parseRoles(session.user.roles),
    },
  }
}

export async function getSession(): Promise<AuthSession | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) return null
  return enrichSession(session)
}

export async function requireAuth(redirectTo = "/auth/auth1/login"): Promise<AuthSession> {
  const session = await getSession()
  if (!session) redirect(redirectTo)
  return session
}

export async function requireAnyRole(
  allowed: AppRole[],
  options?: { redirectTo?: string },
): Promise<AuthSession> {
  const session = await requireAuth(options?.redirectTo)
  if (!hasAnyRole(session.user.roles, allowed)) {
    redirect("/dashboard?error=unauthorized")
  }
  return session
}
