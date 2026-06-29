import { prisma } from "@/lib/prisma"
import { parseRoles } from "@/lib/auth/roles"
import type { OrganizationType } from "@/lib/auth/organization-shared"

const ORG_CREATOR_ROLES = new Set(["SELLER", "BROKER", "INSPECTOR"])

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
}

async function buildUniqueSlug(base: string): Promise<string> {
  const normalized = slugify(base) || "organization"
  let candidate = normalized
  let suffix = 1

  while (await prisma.organization.findUnique({ where: { slug: candidate } })) {
    candidate = `${normalized}-${suffix}`
    suffix += 1
  }

  return candidate
}

export async function createDefaultOrganizationForUser(user: {
  id: string
  name?: string | null
  email: string
  roles?: unknown
}) {
  const roles = parseRoles(user.roles)
  const shouldCreate = roles.some((role) => ORG_CREATOR_ROLES.has(role))

  if (!shouldCreate) return null

  const existing = await prisma.member.findFirst({
    where: { userId: user.id },
    select: { id: true },
  })
  if (existing) return null

  const label = user.name?.trim() || user.email.split("@")[0] || "My"
  const organizationType: OrganizationType = roles.includes("BROKER")
    ? "BROKER"
    : roles.includes("INSPECTOR")
      ? "INSPECTOR"
      : "SELLER"

  return prisma.organization.create({
    data: {
      name: `${label} Aviation`,
      slug: await buildUniqueSlug(`${label}-aviation`),
      organizationType,
      members: {
        create: {
          userId: user.id,
          role: "owner",
        },
      },
    },
  })
}
