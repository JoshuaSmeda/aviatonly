export type AvionicsOtherItem = {
  enabled: boolean;
  name: string;
};

export const EMPTY_AVIONICS_OTHER_ITEM: AvionicsOtherItem = {
  enabled: false,
  name: "",
};

export function parseAvionicsOtherFromSummary(summary?: string | null): AvionicsOtherItem[] {
  if (!summary?.trim()) {
    return [{ ...EMPTY_AVIONICS_OTHER_ITEM }];
  }

  const items = summary
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((name) => ({ enabled: true, name }));

  return items.length > 0 ? items : [{ ...EMPTY_AVIONICS_OTHER_ITEM }];
}

export function formatAvionicsOtherSummary(items?: AvionicsOtherItem[]): string | null {
  const names = (items ?? [])
    .filter((item) => item.enabled && item.name.trim())
    .map((item) => item.name.trim());

  return names.length > 0 ? names.join(", ") : null;
}

export function hasAvionicsOtherContent(items?: AvionicsOtherItem[]): boolean {
  return (items ?? []).some((item) => item.enabled && item.name.trim());
}

export function splitAvionicsItems(
  equipment?: string[] | null,
  summary?: string | null,
): { standard: string[]; custom: string[] } {
  const standard = [...(equipment ?? [])];
  const custom: string[] = [];

  if (summary?.trim()) {
    for (const item of summary.split(",")) {
      const trimmed = item.trim();
      if (trimmed) custom.push(trimmed);
    }
  }

  return { standard, custom };
}

/** Full avionics line for listings: checkbox selections plus custom items from intake. */
export function formatAvionicsDisplay(
  equipment?: string[] | null,
  summary?: string | null,
): string {
  const { standard, custom } = splitAvionicsItems(equipment, summary);
  return [...standard, ...custom].join(", ");
}
