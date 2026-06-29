"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Info, Send } from "lucide-react";
import { toast, Toaster } from "sonner";
import AutosaveIndicator, { type AutosaveStatus } from "./autosave-indicator";
import { IntakeFixModeProvider, useIntakeFixMode } from "./intake-fix-mode-context";
import { INTAKE_STEPS } from "@/lib/aviatonly/domain";
import { formatFieldFixValue, type IntakeFixContext } from "@/lib/aviatonly/domain/intake-fix-mode";
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
import {
  saveDraftListingFromIntake,
  submitAircraftListing,
} from "@/app/(dashboard)/dashboard/seller/upload/actions";
import {
  sellerFixListingDocumentAction,
  sellerFixListingFieldAction,
  sellerFixListingPhotoAction,
} from "@/app/(dashboard)/dashboard/seller/listings/review-fix-actions";
import {
  deleteDraft,
  loadIntakeWizardState,
  saveDraft,
} from "@/app/(dashboard)/dashboard/seller/upload/draft-actions";
import IntakeWizardLoading from "./intake-wizard-loading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

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

interface AircraftIntakeWizardProps {
  listingId?: string;
  initialStep?: number;
  fixContext?: IntakeFixContext | null;
}

const AircraftIntakeWizard = ({
  listingId: initialListingId,
  initialStep,
  fixContext = null,
}: AircraftIntakeWizardProps) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [, setDraftId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<UploadMap>({});
  const [documents, setDocuments] = useState<UploadMap>({});
  const [activeListingId, setActiveListingId] = useState<string | null>(initialListingId ?? null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [savingFix, setSavingFix] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const fixModeActive = Boolean(fixContext);

  const form = useForm<AircraftFormValues>({
    resolver: zodResolver(aircraftSchema),
    defaultValues: aircraftDefaultValues as AircraftFormValues,
    mode: "onTouched",
  });

  const draftIdRef = useRef<string | null>(null);
  const listingIdRef = useRef<string | null>(initialListingId ?? null);
  const stepRef = useRef(0);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isApplyingDraft = useRef(false);
  const savingRef = useRef(false);
  const pendingRef = useRef(false);

  const doSave = useCallback(async (): Promise<boolean> => {
    if (savingRef.current) {
      pendingRef.current = true;
      return false;
    }
    savingRef.current = true;
    setAutosaveStatus("saving");
    try {
      const res = await saveDraft({
        draftId: draftIdRef.current,
        data: {
          ...(form.getValues() as Record<string, unknown>),
          listingId: listingIdRef.current ?? undefined,
        },
        step: stepRef.current,
        listingId: listingIdRef.current,
      });
      draftIdRef.current = res.id;
      setDraftId(res.id);
      setLastSavedAt(new Date());
      setAutosaveStatus("saved");
      return true;
    } catch {
      setAutosaveStatus("error");
      return false;
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

  // Resume draft or listing data from the database (no localStorage).
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoadingInitial(true);

      try {
        const loaded = await loadIntakeWizardState({
          listingId: initialListingId,
          initialStep:
            fixContext?.step ??
            (initialStep != null && initialStep >= 0 ? initialStep : undefined),
          preferListing: fixModeActive,
        });

        if (cancelled) return;

        const effectiveListingId = loaded.listingId ?? initialListingId ?? null;
        if (effectiveListingId) {
          listingIdRef.current = effectiveListingId;
          setActiveListingId(effectiveListingId);
        }

        if (loaded.formData) {
          isApplyingDraft.current = true;
          form.reset({
            ...(aircraftDefaultValues as AircraftFormValues),
            ...reviveDraftValues(loaded.formData),
          });

          const resumedStep = Math.min(
            Math.max(loaded.step, 0),
            INTAKE_STEPS.length - 1,
          );
          stepRef.current = resumedStep;
          setCurrentStep(resumedStep);
          setVisited(new Set(Array.from({ length: resumedStep + 1 }, (_, i) => i)));
        }

        if (loaded.draftId) {
          draftIdRef.current = loaded.draftId;
          setDraftId(loaded.draftId);
        }

        setPhotos(loaded.photos);
        setDocuments(loaded.documents);

        if (loaded.updatedAt) {
          setLastSavedAt(new Date(loaded.updatedAt));
        }

        setAutosaveStatus(
          fixModeActive ? "idle" : loaded.source === "empty" ? "idle" : "saved",
        );
      } catch {
        if (!cancelled) {
          toast.error("Could not load your intake draft. Please refresh and try again.");
          setAutosaveStatus("error");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingInitial(false);
          setTimeout(() => {
            isApplyingDraft.current = false;
          }, 0);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialListingId, initialStep, fixContext, fixModeActive]);

  // Debounced autosave on any field change (skipped in review-fix mode).
  useEffect(() => {
    if (fixModeActive) return;
    const subscription = form.watch(() => {
      if (isApplyingDraft.current) return;
      scheduleSave();
    });
    return () => subscription.unsubscribe();
  }, [form, scheduleSave, fixModeActive]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (fixModeActive && fixContext && index !== fixContext.step) return;
      if (index < 0 || index > INTAKE_STEPS.length - 1) return;
      stepRef.current = index;
      setConfirmed(false);
      setVisited((prev) => new Set(prev).add(index));
      setCurrentStep(index);
      if (!fixModeActive) {
        void doSave();
      }
    },
    [doSave, fixContext, fixModeActive],
  );

  const handleNext = async () => {
    const fields = INTAKE_STEP_FIELDS[currentStep];
    const valid = fields.length === 0 ? true : await form.trigger(fields);
    if (valid) goTo(currentStep + 1);
  };

  const handleSaveFix = async () => {
    if (!fixContext || !listingIdRef.current) return;

    setSavingFix(true);
    try {
      const listingId = listingIdRef.current;

      if (fixContext.type === "field" && fixContext.fieldKey) {
        const fields = fixContext.editableFields;
        const valid = fields.length === 0 ? true : await form.trigger(fields);
        if (!valid) {
          toast.error("Fix the highlighted field before saving.");
          return;
        }

        const value = formatFieldFixValue(form.getValues(), fixContext.fieldKey);
        const result = await sellerFixListingFieldAction({
          listingId,
          fieldKey: fixContext.fieldKey,
          value,
        });
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success(
          result.allFixesSubmitted
            ? "All fixes saved — AVIATONLY will re-review your listing."
            : "Fix saved. Continue with the remaining items.",
        );
        router.push(`/dashboard/listings/${listingId}?tab=review-tasks`);
        return;
      }

      if (fixContext.type === "photo" && fixContext.photoId && fixContext.photoSlot) {
        const upload = photos[fixContext.photoSlot];
        if (!upload || upload.status === "on-file") {
          toast.error("Upload a replacement photo before saving.");
          return;
        }
        const result = await sellerFixListingPhotoAction({
          listingId,
          photoId: fixContext.photoId,
          fileName: upload.name,
        });
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success(
          result.allFixesSubmitted
            ? "All fixes saved — AVIATONLY will re-review your listing."
            : "Photo fix saved. Continue with the remaining items.",
        );
        router.push(`/dashboard/listings/${listingId}?tab=media`);
        return;
      }

      if (fixContext.type === "document" && fixContext.documentId && fixContext.documentSlot) {
        const upload = documents[fixContext.documentSlot];
        if (!upload || upload.sizeLabel === "On file") {
          toast.error("Upload a replacement document before saving.");
          return;
        }
        const result = await sellerFixListingDocumentAction({
          listingId,
          documentId: fixContext.documentId,
          fileName: upload.name,
        });
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success(
          result.allFixesSubmitted
            ? "All fixes saved — AVIATONLY will re-review your listing."
            : "Document fix saved. Continue with the remaining items.",
        );
        router.push(`/dashboard/listings/${listingId}?tab=documents`);
        return;
      }

      toast.error("Could not determine what to fix. Return to your listing and try again.");
    } finally {
      setSavingFix(false);
    }
  };

  const handleSaveAndClose = async () => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    setClosing(true);
    try {
      while (savingRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      const values = form.getValues();
      const photoMeta = Object.entries(photos).map(([slot, file]) => ({
        slot,
        fileName: file.name,
        storageKey: file.storageKey,
        photoId: file.photoId,
      }));
      const documentMeta = Object.entries(documents).map(([slot, file]) => ({
        slot,
        fileName: file.name,
      }));

      const listingResult = await saveDraftListingFromIntake(
        values,
        photoMeta,
        documentMeta,
        listingIdRef.current,
      );

      if (!listingResult.ok) {
        if (listingResult.field) {
          const stepWithField = INTAKE_STEP_FIELDS.findIndex((fields) =>
            fields.includes(listingResult.field!),
          );
          if (stepWithField >= 0) goTo(stepWithField);
          form.setError(listingResult.field, { type: "server", message: listingResult.error });
        }
        toast.error(listingResult.error);
        return;
      }

      listingIdRef.current = listingResult.id;
      setActiveListingId(listingResult.id);

      const res = await saveDraft({
        draftId: draftIdRef.current,
        data: {
          ...(values as Record<string, unknown>),
          listingId: listingResult.id,
        },
        step: stepRef.current,
        listingId: listingResult.id,
      });
      draftIdRef.current = res.id;
      setDraftId(res.id);
      setLastSavedAt(new Date());
      setAutosaveStatus("saved");
      toast.success("Draft saved to your listing workspace.");
      router.push(`/dashboard/listings/${listingResult.id}`);
    } catch {
      setAutosaveStatus("error");
      toast.error("Could not save your draft. Please try again.");
    } finally {
      setClosing(false);
    }
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

    const photoMeta = Object.entries(photos).map(([slot, file]) => ({
      slot,
      fileName: file.name,
      storageKey: file.storageKey,
      photoId: file.photoId,
    }));
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
    toast.success(`${result.registration} submitted for valuation & review.`);
    setSubmitted(true);
  };

  const onInvalid = (errors: Record<string, unknown>) => {
    const firstStep = INTAKE_STEP_FIELDS.findIndex((fields) => fields.some((f) => f in errors));
    if (firstStep >= 0) goTo(firstStep);
    toast.error("Please fix the highlighted fields before submitting.");
  };

  const handlePhotoChange = useCallback((slotId: string, value: UploadedFile | null) => {
    setPhotos((prev) => {
      const previous = prev[slotId];
      if (previous?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previous.previewUrl);
      }
      if (!value) {
        const next = { ...prev };
        delete next[slotId];
        return next;
      }
      return { ...prev, [slotId]: value };
    });
  }, []);

  const handleListingIdChange = useCallback((nextListingId: string) => {
    listingIdRef.current = nextListingId;
    setActiveListingId(nextListingId);
    void saveDraft({
      draftId: draftIdRef.current,
      data: {
        ...(form.getValues() as Record<string, unknown>),
        listingId: nextListingId,
      },
      step: stepRef.current,
      listingId: nextListingId,
    }).then((res) => {
      draftIdRef.current = res.id;
      setDraftId(res.id);
    });
  }, [form]);

  const getFormValues = useCallback(() => form.getValues(), [form]);

  if (isLoadingInitial) {
    return (
      <>
        <Toaster richColors position="top-right" />
        <IntakeWizardLoading />
      </>
    );
  }

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

  const handlePhotoSelect = makeUploadHandler(setPhotos, true);
  const handlePhotoRemove = makeRemoveHandler(setPhotos);
  const handleDocumentSelect = makeUploadHandler(setDocuments, false);
  const handleDocumentRemove = makeRemoveHandler(setDocuments);

  const handleBackToListing = () => {
    if (listingIdRef.current) {
      router.push(`/dashboard/listings/${listingIdRef.current}?tab=review-tasks`);
    }
  };

  return (
    <IntakeFixModeProvider fix={fixContext}>
      <AircraftIntakeWizardForm
        fixModeActive={fixModeActive}
        form={form}
        currentStep={currentStep}
        visited={visited}
        autosaveStatus={autosaveStatus}
        lastSavedAt={lastSavedAt}
        photos={photos}
        documents={documents}
        confirmed={confirmed}
        closing={closing}
        savingFix={savingFix}
        goTo={goTo}
        doSave={doSave}
        handleNext={handleNext}
        handleSaveAndClose={handleSaveAndClose}
        handleSaveFix={handleSaveFix}
        onPhotoSelect={handlePhotoSelect}
        onPhotoRemove={handlePhotoRemove}
        onPhotoChange={handlePhotoChange}
        listingId={activeListingId}
        getFormValues={getFormValues}
        onListingIdChange={handleListingIdChange}
        onDocumentSelect={handleDocumentSelect}
        onDocumentRemove={handleDocumentRemove}
        onBackToListing={handleBackToListing}
        setConfirmed={setConfirmed}
        onValid={onValid}
        onInvalid={onInvalid}
      />
    </IntakeFixModeProvider>
  );
};

interface AircraftIntakeWizardFormProps {
  fixModeActive: boolean;
  form: ReturnType<typeof useForm<AircraftFormValues>>;
  currentStep: number;
  visited: Set<number>;
  autosaveStatus: AutosaveStatus;
  lastSavedAt: Date | null;
  photos: UploadMap;
  documents: UploadMap;
  confirmed: boolean;
  closing: boolean;
  savingFix: boolean;
  goTo: (index: number) => void;
  doSave: () => Promise<boolean>;
  handleNext: () => Promise<void>;
  handleSaveAndClose: () => Promise<void>;
  handleSaveFix: () => Promise<void>;
  onPhotoSelect: (slotId: string, file: File) => void;
  onPhotoRemove: (slotId: string) => void;
  onPhotoChange: (slotId: string, value: UploadedFile | null) => void;
  listingId: string | null;
  getFormValues: () => AircraftFormValues;
  onListingIdChange: (listingId: string) => void;
  onDocumentSelect: (slotId: string, file: File) => void;
  onDocumentRemove: (slotId: string) => void;
  onBackToListing: () => void;
  setConfirmed: (value: boolean) => void;
  onValid: (values: AircraftFormValues) => Promise<void>;
  onInvalid: (errors: Record<string, unknown>) => void;
}

const AircraftIntakeWizardForm = ({
  fixModeActive,
  form,
  currentStep,
  visited,
  autosaveStatus,
  lastSavedAt,
  photos,
  documents,
  confirmed,
  closing,
  savingFix,
  goTo,
  doSave,
  handleNext,
  handleSaveAndClose,
  handleSaveFix,
  onPhotoSelect,
  onPhotoRemove,
  onPhotoChange,
  listingId,
  getFormValues,
  onListingIdChange,
  onDocumentSelect,
  onDocumentRemove,
  onBackToListing,
  setConfirmed,
  onValid,
  onInvalid,
}: AircraftIntakeWizardFormProps) => {
  const { fix } = useIntakeFixMode();
  const step = INTAKE_STEPS[currentStep];
  const totalSteps = INTAKE_STEPS.length;
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  const fixTargetLabel =
    fix?.type === "field"
      ? fix.fieldKey?.replace(/-/g, " ")
      : fix?.type === "photo"
        ? "guided photo"
        : fix?.type === "document"
          ? "document"
          : null;

  return (
    <>
      <Toaster richColors position="top-right" />
      <FormProvider {...form}>
        <div className="flex flex-col gap-6">
          {fixModeActive ? (
            <Alert>
              <Info />
              <AlertTitle>Fix requested by AVIATONLY</AlertTitle>
              <AlertDescription>
                {fixTargetLabel
                  ? `Update the ${fixTargetLabel} below. All other fields are locked — approved data stays unchanged.`
                  : "Only the flagged item is editable. Update it and save."}
              </AlertDescription>
            </Alert>
          ) : null}

          <form
            onSubmit={form.handleSubmit(onValid, onInvalid)}
            className={cn("flex flex-col gap-6", !fixModeActive && "lg:flex-row")}
          >
            {!fixModeActive ? (
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
                            isActive
                              ? "border-primary bg-primary/5"
                              : "border-transparent hover:bg-muted",
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                              isComplete && "border-primary bg-primary text-primary-foreground",
                              isActive && "border-primary bg-background text-primary",
                              !isComplete &&
                                !isActive &&
                                "border-border bg-background text-muted-foreground",
                            )}
                          >
                            {isComplete ? <Check /> : index + 1}
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
            ) : (
              <div className="flex flex-col gap-2 lg:hidden">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{step.title}</span>
                  <span className="text-muted-foreground">
                    Step {currentStep + 1} of {totalSteps}
                  </span>
                </div>
                <Progress value={progress} />
              </div>
            )}

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
                className={cn("shrink-0", fixModeActive && "hidden")}
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
                  onSelect={onPhotoSelect}
                  onRemove={onPhotoRemove}
                  onPhotoChange={onPhotoChange}
                  listingId={listingId}
                  getFormValues={getFormValues}
                  onListingIdChange={onListingIdChange}
                  alertTitle="Guided photo angles"
                  alertDescription="Upload each required angle so buyers can assess condition, gauges, and wear points. Photos upload directly to secure storage as you add them."
                />
              )}
              {currentStep === 9 && (
                <StepUploads
                  variant="document"
                  slots={DOCUMENT_SLOTS}
                  values={documents}
                  onSelect={onDocumentSelect}
                  onRemove={onDocumentRemove}
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

            {isLast && !fixModeActive && (
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
              {fixModeActive ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBackToListing}
                  >
                    <ArrowLeft data-icon="inline-start" />
                    Back to listing
                  </Button>
                  <Button
                    type="button"
                    onClick={() => void handleSaveFix()}
                    disabled={savingFix}
                  >
                    {savingFix && <Spinner />}
                    Save fix
                  </Button>
                </>
              ) : (
                <>
                  <Button type="button" variant="outline" onClick={() => goTo(currentStep - 1)} disabled={isFirst}>
                    <ArrowLeft data-icon="inline-start" />
                    Back
                  </Button>

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void handleSaveAndClose()}
                      disabled={closing || form.formState.isSubmitting}
                    >
                      {closing && <Spinner />}
                      Save & close
                    </Button>
                    {isLast ? (
                      <Button type="submit" disabled={!confirmed || form.formState.isSubmitting || closing}>
                        {form.formState.isSubmitting && <Spinner />}
                        <Send data-icon="inline-start" />
                        Submit for AVIATONLY review
                      </Button>
                    ) : (
                      <Button type="button" onClick={handleNext} disabled={closing}>
                        Next
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
            </div>
          </form>
        </div>
      </FormProvider>
    </>
  );
};

export default AircraftIntakeWizard;
