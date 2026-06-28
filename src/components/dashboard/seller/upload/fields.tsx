"use client";

import { Controller, useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { AircraftFormValues } from "./schema";

type Name = keyof AircraftFormValues;

interface BaseProps {
  name: Name;
  label: string;
  description?: string;
  placeholder?: string;
}

export function RHFText({ name, label, description, placeholder, type = "text" }: BaseProps & { type?: string }) {
  const { control } = useFormContext<AircraftFormValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={`field-${name}`}>{label}</FieldLabel>
          <Input
            id={`field-${name}`}
            type={type}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            {...field}
            value={(field.value as string) ?? ""}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export function RHFTextarea({ name, label, description, placeholder, rows = 3 }: BaseProps & { rows?: number }) {
  const { control } = useFormContext<AircraftFormValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={`field-${name}`}>{label}</FieldLabel>
          <Textarea
            id={`field-${name}`}
            rows={rows}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            {...field}
            value={(field.value as string) ?? ""}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export function RHFNumber({ name, label, description, placeholder, suffix, step }: BaseProps & { suffix?: string; step?: string }) {
  const { control } = useFormContext<AircraftFormValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={`field-${name}`}>{label}</FieldLabel>
          <div className="relative">
            <Input
              id={`field-${name}`}
              type="number"
              inputMode="decimal"
              step={step}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
              className={cn(suffix && "pr-14")}
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              value={field.value === undefined || field.value === null ? "" : String(field.value)}
              onChange={(event) =>
                field.onChange(event.target.value === "" ? undefined : Number(event.target.value))
              }
            />
            {suffix && (
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                {suffix}
              </span>
            )}
          </div>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export function RHFSelect({
  name,
  label,
  description,
  placeholder = "Select an option",
  options,
}: BaseProps & { options: readonly string[] }) {
  const { control } = useFormContext<AircraftFormValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={`field-${name}`}>{label}</FieldLabel>
          <Select value={(field.value as string) || null} onValueChange={field.onChange}>
            <SelectTrigger id={`field-${name}`} className="w-full" aria-invalid={fieldState.invalid}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export function RHFDate({ name, label, description, placeholder = "Pick a date" }: BaseProps) {
  const { control } = useFormContext<AircraftFormValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const dateValue = field.value as Date | undefined;
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`field-${name}`}>{label}</FieldLabel>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    id={`field-${name}`}
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateValue && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="size-4" />
                    {dateValue ? format(dateValue, "PPP") : <span>{placeholder}</span>}
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateValue} onSelect={field.onChange} />
              </PopoverContent>
            </Popover>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
