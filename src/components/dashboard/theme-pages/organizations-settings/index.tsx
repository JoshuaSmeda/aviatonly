"use client"

import { useState, useTransition } from "react"
import { Building2, Mail } from "lucide-react"
import { toast } from "sonner"
import TitleCard from "@/components/dashboard/shared/titleborder-card"
import { authClient } from "@/lib/auth-client"
import {
  ORGANIZATION_MEMBER_ROLES,
  ORGANIZATION_TYPES,
  formatOrganizationRole,
  formatOrganizationType,
  getOrganizationInitials,
  slugifyOrganizationName,
} from "@/lib/auth/organization-shared"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

const OrganizationsSettingIndex = () => {
  const { data: organizations, isPending } = authClient.useListOrganizations()
  const { data: activeOrganization } = authClient.useActiveOrganization()

  const [name, setName] = useState("")
  const [organizationType, setOrganizationType] = useState("SELLER")
  const [province, setProvince] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [isPendingAction, startTransition] = useTransition()

  const handleCreate = () => {
    startTransition(async () => {
      const result = await authClient.organization.create({
        name: name.trim(),
        slug: slugifyOrganizationName(name),
        organizationType,
        province: province.trim() || undefined,
      })

      if (result.error) {
        toast.error(result.error.message ?? "Could not create organization.")
        return
      }

      setName("")
      setProvince("")
      toast.success("Organization created.")
    })
  }

  const handleInvite = () => {
    if (!activeOrganization?.id) {
      toast.error("Select an organization before inviting members.")
      return
    }

    startTransition(async () => {
      const result = await authClient.organization.inviteMember({
        email: inviteEmail.trim(),
        role: inviteRole as "owner" | "admin" | "member",
        organizationId: activeOrganization.id,
      })

      if (result.error) {
        toast.error(result.error.message ?? "Could not send invitation.")
        return
      }

      setInviteEmail("")
      toast.success("Invitation sent.")
    })
  }

  return (
    <TitleCard title="Organizations">
      <div className="flex max-w-2xl flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Your memberships</p>

          {isPending ? (
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-14 w-48 rounded-lg" />
              <Skeleton className="h-14 w-48 rounded-lg" />
            </div>
          ) : organizations?.length ? (
            <div className="flex flex-wrap gap-3">
              {organizations.map((org) => {
                const type =
                  (org as { organizationType?: string }).organizationType ?? "SELLER"

                return (
                  <div
                    key={org.id}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2"
                  >
                    <Avatar size="sm">
                      <AvatarFallback className="bg-muted text-xs font-medium">
                        {getOrganizationInitials(org.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-sm font-medium">{org.name}</span>
                      <Badge variant="outline" className="w-fit">
                        {formatOrganizationType(type)}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">You are not a member of any organizations yet.</p>
          )}
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Create organization</p>
            <p className="text-sm text-muted-foreground">
              Set up a workspace for your brokerage, AMO, or seller team.
            </p>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="org-name">Organization name</FieldLabel>
              <Input
                id="org-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cape Flight Brokers"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="org-type">Organization type</FieldLabel>
              <Select
                value={organizationType}
                onValueChange={(value) => setOrganizationType(value ?? "SELLER")}
              >
                <SelectTrigger id="org-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {ORGANIZATION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {formatOrganizationType(type)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="org-province">Province</FieldLabel>
              <Input
                id="org-province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="Western Cape"
              />
              <FieldDescription>Optional. Helps route regional operations.</FieldDescription>
            </Field>
          </FieldGroup>

          <Button
            className="w-fit"
            disabled={isPendingAction || !name.trim()}
            onClick={handleCreate}
          >
            {isPendingAction ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <Building2 data-icon="inline-start" />
            )}
            Create organization
          </Button>
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Invite member</p>
            <p className="text-sm text-muted-foreground">
              {activeOrganization
                ? `Invitations are sent for ${activeOrganization.name}.`
                : "Select an organization before inviting colleagues."}
            </p>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="invite-email">Email address</FieldLabel>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@example.com"
                disabled={!activeOrganization}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="invite-role">Organization role</FieldLabel>
              <Select
                value={inviteRole}
                onValueChange={(value) => setInviteRole(value ?? "member")}
                disabled={!activeOrganization}
              >
                <SelectTrigger id="invite-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {ORGANIZATION_MEMBER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {formatOrganizationRole(role)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                Organization roles are separate from your AVIATONLY platform roles.
              </FieldDescription>
            </Field>
          </FieldGroup>

          <Button
            className="w-fit"
            disabled={isPendingAction || !inviteEmail.trim() || !activeOrganization}
            onClick={handleInvite}
          >
            {isPendingAction ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <Mail data-icon="inline-start" />
            )}
            Send invitation
          </Button>
        </div>
      </div>
    </TitleCard>
  )
}

export default OrganizationsSettingIndex
