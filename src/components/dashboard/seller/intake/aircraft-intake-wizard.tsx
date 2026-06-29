"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Send } from "lucide-react";
import { toast, Toaster } from "sonner";
import AutosaveIndicator, { type AutosaveStatus } from "./autosave-indicator";
import { INTAKE_STEPS } from "@/lib/aviatonly/domain";
import {
  StepAirframe,
  StepAvionics,
  StepEngine,
  StepIdentity,
  StepListingType,
  StepMaintenance,
  StepOwnership,
  StepPropeller,
  StepSale,
} from "./step-panels";
import StepUploads from "@/components/dashboard/seller/upload/steps/step-uploads";
import StepReview from "@/components/dashboard/seller/upload/steps/step-review";
import { PHOTO_SLOTS, DOCUMENT_SLOTS } from "@/components/dashboard/seller/upload/constants";
import type { UploadedFile } from "@/components/dashboard/seller/upload/upload-slot";
import {
  aircraftDefaultValues,
  aircraftSchema,
  INTAKE_STEP_FIELDS,
  type AircraftFormValues,
} from "@/components/dashboard/seller/upload/schema";
import { submitAircraftListing } from "@/app/(dashboard)/dashboard/seller/upload/actions";
import {
  deleteDraft,
  loadDraft,
  saveDraft,
} from "@/app/(dashboard)/dashboard/seller/upload/draft-actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const DRAFT_KEY = "aviatonly:intake:draftId";

type UploadMap = Record<string, UploadedFile>;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function reviveDraftValues(data: Record<string, unknown>): Partial<AircraftFormValues> {
  const values: Record<string, unknown> = { ...data };
  if (typeof values.lastMpiDate === "string") {
    const parsed = new Date(values.lastMpiDate);
    values.lastMpiDate = Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }
  return values as Partial<AircraftFormValues>;
}

const AircraftIntakeWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [, setDraftId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<UploadMap>({});
  const [documents, setDocuments] = useState<UploadMap>({});
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<AircraftFormValues>({
    resolver: zodResolver(aircraftSchema),
    defaultValues: aircraftDefaultValues as AircraftFormValues,
    mode: "onTouched",
  });

  const draftIdRef = useRef<string | null>(null);
  const stepRef = useRef(0);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isApplyingDraft = useRef(false);
  const savingRef = useRef(false);
  const pendingRef = useRef(false);

  const doSave = useCallback(async () => {
    if (savingRef.current) {
      pendingRef.current = true;
      return;
    }
    savingRef.current = true;
    setAutosaveStatus("saving");
    try {
      const res = await saveDraft({
        draftId: draftIdRef.current,
        data: form.getValues() as Record<string, unknown>,
        step: stepRef.current,
      });
      draftIdRef.current = res.id;
      setDraftId(res.id);
      try {
        localStorage.setItem(DRAFT_KEY, res.id);
      } catch {
        // ignore storage failures (private mode, etc.)
      }
      setLastSavedAt(new Date());
      setAutosaveStatus("saved");
    } catch {
      setAutosaveStatus("error");
    } finally {
      savingRef.current = false;
      if (pendingRef.current) {
        pendingRef.current = false;
        void doSave();
      }
    }
  }, [form]);

  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void doSave(), 1000);
  }, [doSave]);

  // Resume an existing draft from a previous session.
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(DRAFT_KEY) : null;
    if (!stored) return;
    (async () => {
      const draft = await loadDraft(stored);
      if (!draft) {
        localStorage.removeItem(DRAFT_KEY);
        return;
      }
      isApplyingDraft.current = true;
      form.reset({
        ...(aircraftDefaultValues as AircraftFormValues),
        ...reviveDraftValues(draft.data),
      });
      const resumedStep = Math.min(Math.max(draft.step, 0), INTAKE_STEPS.length - 1);
      stepRef.current = resumedStep;
      draftIdRef.current = stored;
      setDraftId(stored);
      setCurrentStep(resumedStep);
      setVisited(new Set(Array.from({ length: resumedStep + 1 }, (_, i) => i)));
      setLastSavedAt(new Date());
      setAutosaveStatus("saved");
      setTimeout(() => {
        isApplyingDraft.current = false;
      }, 0);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced autosave on any field change.
  useEffect(() => {
    const subscription = form.watch(() => {
      if (isApplyingDraft.current) return;
      scheduleSave();
    });
    return () => subscription.unsubscribe();
  }, [form, scheduleSave]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index > INTAKE_STEPS.length - 1) return;
      stepRef.current = index;
      setConfirmed(false);
      setVisited((prev) => new Set(prev).add(index));
      setCurrentStep(index);
      // Each step is independently saved as we move.
      void doSave();
    },
    [doSave],
  );

  const handleNext = async () => {
    const fields = INTAKE_STEP_FIELDS[currentStep];
    const valid = fields.length === 0 ? true : await form.trigger(fields);
    if (valid) goTo(currentStep + 1);
  };

  const makeUploadHandler =
    (setter: React.Dispatch<React.SetStateAction<UploadMap>>, withPreview: boolean) =>
    (slotId: string, file: File) => {
      setter((prev) => {
        const previous = prev[slotId];
        if (previous?.previewUrl) URL.revokeObjectURL(previous.previewUrl);
        return {
          ...prev,
          [slotId]: {
            name: file.name,
            sizeLabel: formatBytes(file.size),
            previewUrl: withPreview ? URL.createObjectURL(file) : undefined,
          },
        };
      });
    };

  const makeRemoveHandler =
    (setter: React.Dispatch<React.SetStateAction<UploadMap>>) => (slotId: string) => {
      setter((prev) => {
        const previous = prev[slotId];
        if (previous?.previewUrl) URL.revokeObjectURL(previous.previewUrl);
        const next = { ...prev };
        delete next[slotId];
        return next;
      });
    };

  const onValid = async (values: AircraftFormValues) => {
    if (!confirmed) return;

    const photoMeta = Object.entries(photos).map(([slot, file]) => ({ slot, fileName: file.name }));
    const documentMeta = Object.entries(documents).map(([slot, file]) => ({
      slot,
      fileName: file.name,
    }));

    const result = await submitAircraftListing(values, photoMeta, documentMeta);
    if (!result.ok) {
      if (result.field === "registration") {
        goTo(1);
        form.setError("registration", { type: "server", message: result.error });
      }
      toast.error(result.error);
      return;
    }

    if (draftIdRef.current) await deleteDraft(draftIdRef.current);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
    toast.success(`${result.registration} submitted for valuation & review.`);
    setSubmitted(true);
  };

  const onInvalid = (errors: Record<string, unknown>) => {
    const firstStep = INTAKE_STEP_FIELDS.findIndex((fields) => fields.some((f) => f in errors));
    if (firstStep >= 0) goTo(firstStep);
    toast.error("Please fix the highlighted fields before submitting.");
  };

  if (submitted) {
    const reg = form.getValues("registration");
    return (
      <>
        <Toaster richColors position="top-right" />
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 py-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-8" />
          </div>
          <h4 className="text-xl font-semibold">Submitted for review</h4>
          <p className="text-sm text-muted-foreground">
            {reg ? `${reg} has` : "Your aircraft has"} been submitted to AVIATONLY. Our team will
            review the data and schedule an inspection or verification where needed before it goes
            live.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              form.reset(aircraftDefaultValues as AircraftFormValues);
              setPhotos({});
              setDocuments({});
              setCurrentStep(0);
              stepRef.current = 0;
              setVisited(new Set([0]));
              draftIdRef.current = null;
              setDraftId(null);
              setConfirmed(false);
              setSubmitted(false);
              setAutosaveStatus("idle");
              setLastSavedAt(null);
            }}
          >
            List another aircraft
          </Button>
        </div>
      </>
    );
  }

  const step = INTAKE_STEPS[currentStep];
  const totalSteps = INTAKE_STEPS.length;
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <>
      <Toaster richColors position="top-right" />
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onValid, onInvalid)} className="flex flex-col gap-6 lg:flex-row">
          {/* Step navigation */}
          <aside className="shrink-0 lg:w-72">
            <ol className="hidden flex-col gap-1 lg:flex">
              {INTAKE_STEPS.map((s, index) => {
                const isActive = index === currentStep;
                const isComplete = visited.has(index) && !isActive;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      aria-current={isActive ? "step" : undefined}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                        isActive ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                          isComplete && "border-primary bg-primary text-primary-foreground",
                          isActive && "border-primary bg-background text-primary",
                          !isComplete && !isActive && "border-border bg-background text-muted-foreground",
                        )}
                      >
                        {isComplete ? <Check className="size-4" /> : index + 1}
                      </span>
                      <span
                        className={cn(
                          "text-sm",
                          isActive ? "font-medium text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {s.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="flex flex-col gap-2 lg:hidden">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{step.title}</span>
                <span className="text-muted-foreground">
                  Step {currentStep + 1} of {totalSteps}
                </span>
              </div>
              <Progress value={progress} />
            </div>
          </aside>

          {/* Step panel */}
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Step {currentStep + 1} of {totalSteps}
                </span>
                <h5 className="text-lg font-semibold">{step.title}</h5>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              <AutosaveIndicator
                status={autosaveStatus}
                lastSavedAt={lastSavedAt}
                onRetry={doSave}
                className="shrink-0"
              />
            </div>

            <div className="min-h-[18rem]">
              {currentStep === 0 && <StepListingType />}
              {currentStep === 1 && <StepIdentity />}
              {currentStep === 2 && <StepOwnership />}
              {currentStep === 3 && <StepAirframe />}
              {currentStep === 4 && <StepEngine />}
              {currentStep === 5 && <StepPropeller />}
              {currentStep === 6 && <StepAvionics />}
              {currentStep === 7 && <StepMaintenance />}
              {currentStep === 8 && (
                <StepUploads
                  variant="photo"
                  slots={PHOTO_SLOTS}
                  values={photos}
                  onSelect={makeUploadHandler(setPhotos, true)}
                  onRemove={makeRemoveHandler(setPhotos)}
                  alertTitle="Guided photos are optional for now"
                  alertDescription="You can skip this step and add photos later, but listings with the full guided set are verified faster."
                />
              )}
              {currentStep === 9 && (
                <StepUploads
                  variant="document"
                  slots={DOCUMENT_SLOTS}
                  values={documents}
                  onSelect={makeUploadHandler(setDocuments, false)}
                  onRemove={makeRemoveHandler(setDocuments)}
                  alertTitle="Documents are private and optional for now"
                  alertDescription="Logbooks and certificates are stored privately and only released after authorization. You can skip and upload them during review."
                />
              )}
              {currentStep === 10 && <StepSale />}
              {currentStep === 11 && (
                <StepReview
                  photoCount={Object.keys(photos).length}
                  documentCount={Object.keys(documents).length}
                />
              )}
            </div>

            {isLast && (
              <Field orientation="horizontal" className="rounded-lg border border-border p-4">
                <Checkbox
                  id="confirm-accuracy"
                  checked={confirmed}
                  onCheckedChange={(value) => setConfirmed(value === true)}
                />
                <FieldLabel htmlFor="confirm-accuracy" className="font-normal">
                  I&apos;ve reviewed the details above, confirm they&apos;re accurate, and I&apos;m
                  authorised to list this aircraft.
                </FieldLabel>
              </Field>
            )}

            <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="outline" onClick={() => goTo(currentStep - 1)} disabled={isFirst}>
                <ArrowLeft data-icon="inline-start" />
                Back
              </Button>

              <div className="flex items-center gap-3">
                {isLast ? (
                  <Button type="submit" disabled={!confirmed || form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Spinner />}
                    <Send data-icon="inline-start" />
                    Submit for AVIATONLY review
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNext}>
                    Next
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AircraftIntakeWizard;
