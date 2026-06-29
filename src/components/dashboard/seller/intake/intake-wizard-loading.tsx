import { Skeleton } from "@/components/ui/skeleton";
import { INTAKE_STEPS } from "@/lib/aviatonly/domain";

const IntakeWizardLoading = () => {
  return (
    <div
      className="flex flex-col gap-6 lg:flex-row"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading aircraft intake wizard"
    >
      <aside className="hidden shrink-0 flex-col gap-2 lg:flex lg:w-72">
        {INTAKE_STEPS.map((step) => (
          <div key={step.id} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
            <Skeleton className="size-7 shrink-0 rounded-full" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex flex-col gap-2 lg:hidden">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>

        <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
          <Skeleton className="h-8 w-28 shrink-0" />
        </div>

        <div className="flex min-h-[18rem] flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-2/3" />
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-24" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntakeWizardLoading;
