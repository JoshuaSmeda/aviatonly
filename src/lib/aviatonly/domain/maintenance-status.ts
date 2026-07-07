/** Maintenance statuses where a current MPI is not expected or applicable. */
export const MAINTENANCE_STATUSES_WITHOUT_MPI = [
  "Project / non-flying",
  "Stored — not currently airworthy",
] as const;

export function maintenanceStatusRequiresMpiDate(status?: string | null): boolean {
  if (!status) return false;
  return !(MAINTENANCE_STATUSES_WITHOUT_MPI as readonly string[]).includes(status);
}

export function resolveLastMpiDate(
  status: string | undefined,
  lastMpiDate: Date | undefined,
): Date | null {
  return maintenanceStatusRequiresMpiDate(status) ? (lastMpiDate ?? null) : null;
}
