"use client"

import { useMemo, useTransition } from "react"
import Link from "next/link"
import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react"
import { toast } from "sonner"
import { authClient, useSession } from "@/lib/auth-client"
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
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default function OrganizationSwitcher() {
  const { data: session } = useSession()
  const { data: organizations, isPending: orgsPending } =
    authClient.useListOrganizations()
  const { data: activeOrganization, isPending: activePending } =
    authClient.useActiveOrganization()
  const [isPending, startTransition] = useTransition()

  const isLoading = orgsPending || activePending
  const items = useMemo(() => organizations ?? [], [organizations])

  if (!session?.user) {
    return null
  }

  const handleSetActive = (organizationId: string) => {
    startTransition(async () => {
      const result = await authClient.organization.setActive({
        organizationId,
      })
      if (result.error) {
        toast.error(result.error.message ?? "Could not switch organization.")
        return
      }
      toast.success("Active organization updated.")
    })
  }

  if (isLoading) {
    return <Skeleton className="hidden md:block h-9 w-44 rounded-md" />
  }

  const hasOrganization = items.length > 0

  if (!hasOrganization) {
    return (
      <div className="hidden md:block">
        <Button
          variant="outline"
          size="sm"
          disabled
          className="max-w-56 justify-between gap-2 text-muted-foreground opacity-60"
          aria-label="No organization assigned"
        >
          <Building2 data-icon="inline-start" />
          <span className="truncate"></span>
          <ChevronsUpDown data-icon="inline-end" className="opacity-40" />
        </Button>
      </div>
    )
  }

  return (
    <div className="hidden md:block">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="sm"
              className="max-w-56 justify-between gap-2"
              disabled={isPending}
            />
          }
        >
          <Building2 data-icon="inline-start" />
          <span className="truncate">
            {activeOrganization?.name ?? "Select organization"}
          </span>
          <ChevronsUpDown data-icon="inline-end" className="opacity-60" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Organizations</DropdownMenuLabel>
            {items.length === 0 ? (
              <DropdownMenuItem disabled>No organizations yet</DropdownMenuItem>
            ) : (
              items.map((org) => {
                const isActive = activeOrganization?.id === org.id
                return (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => handleSetActive(org.id)}
                    className="justify-between"
                  >
                    <span className="truncate">{org.name}</span>
                    <Check
                      className={cn(
                        "text-primary",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </DropdownMenuItem>
                )
              })
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem render={<Link href="/dashboard/settings/organizations" />}>
              <Plus />
              Manage organizations
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
