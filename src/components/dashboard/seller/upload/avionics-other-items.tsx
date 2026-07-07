"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useIntakeFieldDisabled } from "@/components/dashboard/seller/intake/intake-fix-mode-context";
import type { AircraftFormValues } from "./schema";

export function AvionicsOtherItems() {
  const { control } = useFormContext<AircraftFormValues>();
  const disabled = useIntakeFieldDisabled("avionicsOther");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "avionicsOther",
  });

  return (
    <FieldSet>
      <FieldLegend variant="label">Anything else?</FieldLegend>
      <FieldDescription>
        Tick each extra item that&apos;s fitted, then name it — e.g. Garmin GTN 750, weather radar,
        portable oxygen.
      </FieldDescription>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fields.map((field, index) => (
          <Controller
            key={field.id}
            control={control}
            name={`avionicsOther.${index}`}
            render={({ field: rowField }) => {
              const rowId = `avionics-other-${field.id}`;
              const checked = rowField.value?.enabled ?? false;
              const nameValue = rowField.value?.name ?? "";

              return (
                <div className="flex items-center gap-2">
                  <Field orientation="horizontal" className="min-w-0 flex-1">
                    <Checkbox
                      id={rowId}
                      checked={checked}
                      disabled={disabled}
                      onCheckedChange={(value) =>
                        rowField.onChange({
                          ...rowField.value,
                          enabled: value === true,
                        })
                      }
                    />
                    <Input
                      id={`${rowId}-name`}
                      aria-labelledby={rowId}
                      className="min-w-0 flex-1"
                      placeholder="e.g. Garmin GTN 750"
                      disabled={disabled || !checked}
                      value={nameValue}
                      onChange={(event) =>
                        rowField.onChange({
                          ...rowField.value,
                          name: event.target.value,
                        })
                      }
                    />
                  </Field>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={disabled}
                      aria-label="Remove item"
                      onClick={() => remove(index)}
                    >
                      <Trash2Icon />
                    </Button>
                  )}
                </div>
              );
            }}
          />
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => append({ enabled: true, name: "" })}
      >
        <PlusIcon data-icon="inline-start" />
        Add another item
      </Button>
    </FieldSet>
  );
}
