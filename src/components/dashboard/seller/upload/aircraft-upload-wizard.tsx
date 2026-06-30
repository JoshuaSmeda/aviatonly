"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import {
  CheckCircle2,
  ClipboardList,
  Images,
  Plane,
  Send,
  ShieldCheck,
  Tag,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  aircraftDefaultValues,
  aircraftSchema,
  STEP_FIELDS,
  type AircraftFormValues,
} from "./schema";
import { PHOTO_SLOTS, DOCUMENT_SLOTS } from "./constants";
import type { UploadedFile } from "./upload-slot";
import { submitAircraftListing } from "@/app/(dashboard)/dashboard/seller/upload/actions";
import { loadGuidedPhotosForListing } from "@/app/(dashboard)/dashboard/seller/upload/photo-actions";
import StepBasicDetails from "./steps/step-basic-details";
import StepTechnical from "./steps/step-technical";
import StepUploads from "./steps/step-uploads";
import StepPricing from "./steps/step-pricing";
import StepReview from "./steps/step-review";

const STEPS = [
  { label: "Basic details", icon: Plane },
  { label: "Technical", icon: Wrench },
  { label: "Photos", icon: Images },
  { label: "Documents", icon: ClipboardList },
  { label: "Pricing", icon: Tag },
  { label: "Review", icon: ShieldCheck },
] as const;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type UploadMap = Record<string, UploadedFile>;

const AircraftUploadWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [photos, setPhotos] = useState<UploadMap>({});
  const [documents, setDocuments] = useState<UploadMap>({});
  const [listingId, setListingId] = useState<string | null>(null);

  const form = useForm<AircraftFormValues>({
    resolver: zodResolver(aircraftSchema),
    defaultValues: aircraftDefaultValues as AircraftFormValues,
    mode: "onTouched",
  });

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

  const getFormValues = useCallback(() => form.getValues(), [form]);

  useEffect(() => {
    if (!listingId) return;
    void loadGuidedPhotosForListing(listingId).then((resolved) => {
      setPhotos((prev) => {
        const next: UploadMap = { ...resolved };
        for (const [slotId, file] of Object.entries(prev)) {
          if (file.status === "uploading") {
            next[slotId] = file;
          }
        }
        return next;
      });
    });
  }, [listingId]);

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

  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep];
    const valid = fields.length === 0 ? true : await form.trigger(fields);
    if (valid) setCurrentStep((step) => Math.min(step + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setConfirmed(false);
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const onValid = async (values: AircraftFormValues) => {
    // Defensive guard: submission must be an explicit, confirmed action.
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
        setCurrentStep(0);
        form.setError("registration", { type: "server", message: result.error });
      }
      toast.error(result.error);
      return;
    }

    toast.success(`${result.registration} submitted for valuation & review.`);
    setSubmitted(true);
  };

  const onInvalid = (errors: Record<string, unknown>) => {
    const firstStep = STEP_FIELDS.findIndex((fields) => fields.some((f) => f in errors));
    if (firstStep >= 0) setCurrentStep(firstStep);
    toast.error("Please fix the highlighted fields before submitting.");
  };

  if (submitted) {
    const reg = form.getValues("registration");
    return (
      <>
        <Toaster richColors position="top-right" />
        <Card className="mx-auto max-w-2xl">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-8" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-xl font-semibold">Submitted for review</h4>
              <p className="text-sm text-muted-foreground">
                {reg ? `${reg} has` : "Your aircraft has"} been submitted to AVIATONLY. Our team
                will review the data and schedule an inspection or verification where needed before
                it goes live.
              </p>
            </div>
            <div className="mt-2 w-full rounded-lg border border-border bg-muted/30 p-4 text-left">
              <p className="text-sm font-medium">What happens next</p>
              <ul className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                <li>1. Automated pre-valuation of your aircraft.</li>
                <li>2. Document &amp; logbook verification by our team.</li>
                <li>3. Independent inspection scheduled if required.</li>
                <li>4. Listing published as fixed-price or auction.</li>
              </ul>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset(aircraftDefaultValues as AircraftFormValues);
                  setPhotos({});
                  setDocuments({});
                  setCurrentStep(0);
                  setConfirmed(false);
                  setSubmitted(false);
                }}
              >
                List another aircraft
              </Button>
              <Button render={<Link href="/dashboard/listings" />}>Back to My Aircraft</Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <>
      <Toaster richColors position="top-right" />
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onValid, onInvalid)}
          className="flex flex-col gap-6"
        >
          {/* Stepper */}
          <div className="flex flex-col gap-4">
            <div className="hidden items-center md:flex">
              {STEPS.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isComplete = index < currentStep;
                return (
                  <div key={step.label} className="flex flex-1 items-center last:flex-none">
                    <button
                      type="button"
                      onClick={() => index < currentStep && setCurrentStep(index)}
                      disabled={index > currentStep}
                      className={cn(
                        "flex items-center gap-2 text-left",
                        index < currentStep && "cursor-pointer",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors",
                          isActive && "border-primary bg-primary text-primary-foreground",
                          isComplete && "border-primary bg-primary/10 text-primary",
                          !isActive && !isComplete && "border-border text-muted-foreground",
                        )}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="size-5" />
                        ) : (
                          <StepIcon className="size-4" />
                        )}
                      </span>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isActive ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {step.label}
                      </span>
                    </button>
                    {index < STEPS.length - 1 && (
                      <span
                        className={cn(
                          "mx-3 h-px flex-1",
                          index < currentStep ? "bg-primary" : "bg-border",
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile progress */}
            <div className="flex flex-col gap-2 md:hidden">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{STEPS[currentStep].label}</span>
                <span className="text-muted-foreground">
                  Step {currentStep + 1} of {STEPS.length}
                </span>
              </div>
              <Progress value={((currentStep + 1) / STEPS.length) * 100} />
            </div>
          </div>

          {/* Step content */}
          <div className="min-h-[20rem]">
            {currentStep === 0 && <StepBasicDetails />}
            {currentStep === 1 && <StepTechnical />}
            {currentStep === 2 && (
              <StepUploads
                variant="photo"
                slots={PHOTO_SLOTS}
                values={photos}
                onSelect={makeUploadHandler(setPhotos, true)}
                onRemove={makeRemoveHandler(setPhotos)}
                onPhotoChange={handlePhotoChange}
                listingId={listingId}
                getFormValues={getFormValues}
                onListingIdChange={setListingId}
                alertTitle="Guided photo angles"
                alertDescription="Upload each required angle so buyers can assess condition, gauges, and wear points. Photos upload directly to secure storage as you add them."
              />
            )}
            {currentStep === 3 && (
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
            {currentStep === 4 && <StepPricing />}
            {currentStep === 5 && (
              <StepReview
                photoCount={Object.keys(photos).length}
                documentCount={Object.keys(documents).length}
              />
            )}
          </div>

          {/* Confirmation gate — only on the review step */}
          {isLastStep && (
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

          {/* Navigation */}
          <div className="flex items-center justify-between border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>

            {isLastStep ? (
              <Button type="submit" disabled={!confirmed || form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Spinner />}
                <Send />
                Submit for valuation
              </Button>
            ) : (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AircraftUploadWizard;
