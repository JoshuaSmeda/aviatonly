import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { organization } from "better-auth/plugins"
import { prisma } from "@/lib/prisma"
import { createDefaultOrganizationForUser } from "@/lib/auth/organization-server"

const organizationPlugin = organization({
  allowUserToCreateOrganization: true,
  schema: {
    organization: {
      modelName: "Organization",
      additionalFields: {
        organizationType: {
          type: "string",
          required: false,
          defaultValue: "SELLER",
          input: true,
        },
        province: {
          type: "string",
          required: false,
          input: true,
        },
      },
    },
    member: {
      modelName: "Member",
    },
    invitation: {
      modelName: "Invitation",
    },
  },
})

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      roles: {
        type: "string[]",
        required: true,
        defaultValue: ["SELLER"],
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await createDefaultOrganizationForUser({
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles,
          })
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const membership = await prisma.member.findFirst({
            where: { userId: session.userId },
            orderBy: { createdAt: "asc" },
            select: { organizationId: true },
          })

          if (!membership?.organizationId) {
            return { data: session }
          }

          return {
            data: {
              ...session,
              activeOrganizationId: membership.organizationId,
            },
          }
        },
      },
    },
  },
  plugins: [organizationPlugin, nextCookies()],
})

export type Session = typeof auth.$Infer.Session
