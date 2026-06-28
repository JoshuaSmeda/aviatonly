"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RHFNumber, RHFSelect, RHFText } from "../fields";
import { AIRCRAFT_CATEGORIES, SA_PROVINCES } from "../constants";
import type { AircraftFormValues } from "../schema";

const StepBasicDetails = () => {
  const { control } = useFormContext<AircraftFormValues>();

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
    </div>
  );
};

export default StepBasicDetails;
