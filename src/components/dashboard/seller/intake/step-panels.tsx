"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  RHFDate,
  RHFNumber,
  RHFSelect,
  RHFText,
  RHFTextarea,
} from "@/components/dashboard/seller/upload/fields";
import {
  AIRCRAFT_CATEGORIES,
  AVIONICS_OPTIONS,
  DEFAULT_PLATFORM_COMMISSION_RATE,
  MAINTENANCE_STATUSES,
  SA_PROVINCES,
  ZAR,
  estimateCommission,
} from "@/components/dashboard/seller/upload/constants";
import { SELLER_ROLES } from "@/lib/aviatonly/domain";
import {
  useIntakeFieldDisabled,
} from "@/components/dashboard/seller/intake/intake-fix-mode-context";
import type { AircraftFormValues } from "@/components/dashboard/seller/upload/schema";

const SectionHeading = ({ title }: { title: string }) => (
  <div className="col-span-full">
    <h6 className="text-base font-semibold">{title}</h6>
  </div>
);

export const StepListingType = () => {
  const { control } = useFormContext<AircraftFormValues>();
  const disabled = useIntakeFieldDisabled("saleType");
  return (
    <Controller
      control={control}
      name="saleType"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>How do you want to sell?</FieldLabel>
          <RadioGroup
            value={field.value ?? ""}
            onValueChange={field.onChange}
            disabled={disabled}
            className="grid gap-4 md:grid-cols-2"
          >
            <FieldLabel htmlFor="sale-fixed" className="font-normal">
              <Field orientation="horizontal">
                <RadioGroupItem value="FIXED_PRICE" id="sale-fixed" />
                <span className="flex flex-col gap-0.5">
                  <span className="font-medium">Fixed price</span>
                  <span className="text-sm text-muted-foreground">
                    List at an asking price and take offers.
                  </span>
                </span>
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="sale-auction" className="font-normal">
              <Field orientation="horizontal">
                <RadioGroupItem value="AUCTION" id="sale-auction" />
                <span className="flex flex-col gap-0.5">
                  <span className="font-medium">Timed auction</span>
                  <span className="text-sm text-muted-foreground">
                    Run a timed auction with a reserve.
                  </span>
                </span>
              </Field>
            </FieldLabel>
          </RadioGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export const StepIdentity = () => {
  const { control } = useFormContext<AircraftFormValues>();
  const registrationTypeDisabled = useIntakeFieldDisabled("registrationType");
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <RHFText
        name="registration"
        label="Registration"
        placeholder="ZS-ABC"
        description="SACAA registration mark."
      />
      <Controller
        control={control}
        name="registrationType"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Registration type</FieldLabel>
            <RadioGroup
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={registrationTypeDisabled}
              className="flex gap-6"
            >
              <Field orientation="horizontal" className="w-auto">
                <RadioGroupItem value="ZS" id="reg-zs" />
                <FieldLabel htmlFor="reg-zs" className="font-normal">
                  ZS — type-certified
                </FieldLabel>
              </Field>
              <Field orientation="horizontal" className="w-auto">
                <RadioGroupItem value="ZU" id="reg-zu" />
                <FieldLabel htmlFor="reg-zu" className="font-normal">
                  ZU — non-type-certified
                </FieldLabel>
              </Field>
            </RadioGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <RHFText name="make" label="Make" placeholder="Cessna" />
      <RHFText name="model" label="Model" placeholder="172N Skyhawk" />
      <RHFNumber name="year" label="Year of manufacture" placeholder="1978" />
      <RHFSelect
        name="category"
        label="Aircraft category"
        placeholder="Select category"
        options={AIRCRAFT_CATEGORIES}
      />
    </div>
  );
};

export const StepOwnership = () => {
  const { control } = useFormContext<AircraftFormValues>();
  const authorisedDisabled = useIntakeFieldDisabled("authorisedToSell");
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <RHFText name="ownerName" label="Registered owner" placeholder="As shown on the C of R" />
        <RHFSelect
          name="sellerRole"
          label="Your role"
          placeholder="Select your role"
          options={SELLER_ROLES}
        />
      </div>
      <Controller
        control={control}
        name="authorisedToSell"
        render={({ field, fieldState }) => (
          <Field className="gap-2">
            <Field
              orientation="horizontal"
              data-invalid={fieldState.invalid}
              className="rounded-lg border border-border p-4 data-[invalid=true]:border-destructive"
            >
              <Checkbox
                id="authorised-to-sell"
                checked={field.value === true}
                onCheckedChange={(value) => field.onChange(value === true)}
                disabled={authorisedDisabled}
                aria-invalid={fieldState.invalid}
              />
              <FieldLabel htmlFor="authorised-to-sell" className="font-normal">
                I confirm I am the registered owner or am authorised to sell this aircraft.
              </FieldLabel>
            </Field>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
};

export const StepAirframe = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    <RHFNumber
      name="ttaf"
      label="Total time on airframe (TTAF)"
      placeholder="3250"
      suffix="hrs"
      step="0.1"
    />
    <RHFText
      name="airfield"
      label="Base airfield"
      placeholder="FALA — Lanseria"
      description="ICAO code and/or name where the aircraft is based."
    />
    <RHFSelect
      name="province"
      label="Province"
      placeholder="Select province"
      options={SA_PROVINCES}
    />
    <div className="md:col-span-2">
      <RHFTextarea
        name="knownDefects"
        label="Known defects or damage history"
        placeholder="Be upfront about any damage history, deferred items, or known snags."
        rows={3}
      />
    </div>
  </div>
);

export const StepEngine = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    <SectionHeading title="Engine" />
    <RHFText name="engineMakeModel" label="Engine make / model" placeholder="Lycoming O-320-H2AD" />
    <RHFNumber name="engineHours" label="Engine hours" placeholder="1450" suffix="hrs" step="0.1" />
    <RHFNumber
      name="tso"
      label="Time since overhaul (TSO)"
      placeholder="650"
      suffix="hrs"
      step="0.1"
      description="Leave blank if not overhauled."
    />
  </div>
);

export const StepPropeller = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    <SectionHeading title="Propeller" />
    <RHFText name="propellerMakeModel" label="Propeller make / model" placeholder="McCauley 1C160" />
    <RHFNumber name="propellerHours" label="Propeller hours" placeholder="650" suffix="hrs" step="0.1" />
  </div>
);

export const StepAvionics = () => {
  const { control } = useFormContext<AircraftFormValues>();
  const avionicsDisabled = useIntakeFieldDisabled("avionicsEquipment");
  return (
    <div className="flex flex-col gap-6">
      <Controller
        control={control}
        name="avionicsEquipment"
        render={({ field }) => {
          const selected = field.value ?? [];
          const toggle = (item: string) =>
            field.onChange(
              selected.includes(item)
                ? selected.filter((value) => value !== item)
                : [...selected, item],
            );
          return (
            <FieldSet>
              <FieldLegend variant="label">Installed avionics &amp; equipment</FieldLegend>
              <FieldDescription>Tick everything that&apos;s fitted and working.</FieldDescription>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {AVIONICS_OPTIONS.map((option) => {
                  const id = `avionics-${option}`;
                  return (
                    <Field key={option} orientation="horizontal">
                      <Checkbox
                        id={id}
                        checked={selected.includes(option)}
                        onCheckedChange={() => toggle(option)}
                        disabled={avionicsDisabled}
                      />
                      <FieldLabel htmlFor={id} className="font-normal">
                        {option}
                      </FieldLabel>
                    </Field>
                  );
                })}
              </div>
            </FieldSet>
          );
        }}
      />
      <RHFTextarea
        name="avionics"
        label="Anything else?"
        placeholder="List any other avionics or equipment not covered above — e.g. specific Garmin units, weather radar, oxygen system…"
        rows={3}
      />
    </div>
  );
};

export const StepMaintenance = () => (
  <div className="flex flex-col gap-6">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <RHFSelect
        name="maintenanceStatus"
        label="Maintenance status"
        placeholder="Select status"
        options={MAINTENANCE_STATUSES}
      />
      <RHFDate name="lastMpiDate" label="Last MPI date" />
    </div>
  </div>
);

export const StepSale = () => {
  const { watch } = useFormContext<AircraftFormValues>();
  const saleType = watch("saleType");
  const basePrice = saleType === "AUCTION" ? watch("startingBid") : watch("askingPrice");
  const estimate = estimateCommission(basePrice);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {saleType === "FIXED_PRICE" ? (
          <RHFNumber name="askingPrice" label="Asking price" placeholder="850000" suffix="ZAR" />
        ) : (
          <>
            <RHFNumber name="startingBid" label="Starting bid" placeholder="650000" suffix="ZAR" />
            <RHFNumber name="bidIncrement" label="Bid increment" placeholder="10000" suffix="ZAR" />
            <RHFNumber
              name="reservePrice"
              label="Reserve price (optional)"
              placeholder="800000"
              suffix="ZAR"
            />
          </>
        )}
        <RHFNumber
          name="valuationEstimate"
          label="Your valuation estimate (optional)"
          placeholder="900000"
          suffix="ZAR"
          description="Helps our team prepare an internal valuation."
        />
      </div>

      <Separator />

      {estimate && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium">Estimated platform commission</p>
          <p className="mt-1 text-sm text-muted-foreground">
            At {(DEFAULT_PLATFORM_COMMISSION_RATE * 100).toFixed(1)}% (excl. VAT) on{" "}
            {ZAR.format(basePrice ?? 0)}, commission is{" "}
            <span className="font-medium text-foreground">{ZAR.format(estimate.commission)}</span>{" "}
            (+{ZAR.format(estimate.vat)} VAT). Indicative only — final commission applies to the
            agreed sale price.
          </p>
        </div>
      )}
    </div>
  );
};
