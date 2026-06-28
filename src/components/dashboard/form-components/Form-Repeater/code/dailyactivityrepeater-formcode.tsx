"use client";
import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

function DailyActivityRepeaterFormCode() {
  const activitySchema = z.object({
    time: z
      .string({ required_error: "Time is required." })
      .regex(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Time must be in HH:mm format (e.g., 09:30).",
      ),
    activityTitle: z
      .string({ required_error: "Activity Title is required." })
      .min(1, "Activity Title cannot be empty."),
  });
  const formSchema = z.object({
    activities: z
      .array(activitySchema)
      .min(1, "Please add at least one activity."),
  });
  const defaultValues = {
    activities: [{ time: "09:00", activityTitle: "Morning Meeting" }],
  };
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "activities",
  });
  const onSubmit = async (data: any) => {
    alert(JSON.stringify(data, null, 2));
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 max-w-full mt-2"
    >
      {fields.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col sm:flex-row gap-4 border border-ld p-4 rounded-md"
        >
          <div className="grow grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name={`activities.${index}.time`}
              render={({ field, fieldState }: any) => (
                <Field>
                  <FieldLabel>Time (HH:mm)</FieldLabel>

                  <Input type="time" placeholder="HH:mm" {...field} />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name={`activities.${index}.activityTitle`}
              render={({ field, fieldState }: any) => (
                <Field>
                  <FieldLabel>Activity Title</FieldLabel>

                  <Input
                    type="text"
                    placeholder="e.g., Standup Meeting"
                    {...field}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="flex items-end justify-end gap-2 sm:justify-start">
            <Button
              type="button"
              onClick={() => append({ time: "", activityTitle: "" })}
              className="w-10 h-10"
            >
              <Icon icon="mdi:plus" className="h-4 w-4 " />
            </Button>
            {fields.length > 1 && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
                className="w-10 h-10"
              >
                <Icon icon="mdi:trash-can-outline" className="h-4 w-4" />
                <span className="sr-only">Remove activity</span>
              </Button>
            )}
          </div>
        </div>
      ))}
      {form.formState.errors.activities && (
        <p className="text-sm font-medium text-destructive mt-2">
          {form.formState.errors.activities.message as any}
        </p>
      )}
      <div className="flex items-center gap-4">
        <Button type="submit" className="w-fit mt-0">
          Submit
        </Button>
      </div>
    </form>
  );
}

export default DailyActivityRepeaterFormCode;
