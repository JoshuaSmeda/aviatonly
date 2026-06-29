import type { Badge } from "@/components/ui/badge";

export type BadgeVariant = NonNullable<React.ComponentProps<typeof Badge>["variant"]>;

export interface StatusMeta {
  /** Human, domain-specific label. Never a vague label like "Pending". */
  label: string;
  /** Short explanation for tooltips and workflow UI. */
  description: string;
  /** shadcn Badge variant for status badges. */
  badgeVariant: BadgeVariant;
}
