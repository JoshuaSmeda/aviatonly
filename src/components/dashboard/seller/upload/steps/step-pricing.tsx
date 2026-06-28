"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { RHFNumber } from "../fields";
import { DEFAULT_PLATFORM_COMMISSION_RATE, ZAR, estimateCommission } from "../constants";
import type { AircraftFormValues } from "../schema";

const StepPricing = () => {
  const { control, watch } = useFormContext<AircraftFormValues>();
  const saleType = watch("saleType");
  const basePrice = saleType === "AUCTION" ? watch("startingBid") : watch("askingPrice");
  const estimate = estimateCommission(basePrice);

  return (
    <div className="flex flex-col gap-6">
      <Controller
        control={control}
        name="saleType"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>How do you want to sell?</FieldLabel>
            <RadioGroup
              value={field.value ?? ""}
              onValueChange={field.onChange}
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

      <Separator />

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

export default StepPricing;
