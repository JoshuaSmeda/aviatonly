"use client";
import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

function EmployeeRepeaterFormCode() {
  const teamMemberSchema = z.object({
    name: z.string().min(1, { message: "Team member name is required." }),
    role: z.string().min(1, { message: "Role is required." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
  });
  const formSchema = z.object({
    teamMembers: z
      .array(teamMemberSchema)
      .min(2, { message: "At least 2 team members are required." }),
  });
  const defaultValues = {
    teamMembers: [
      { name: "", role: "", email: "" },
      { name: "", role: "", email: "" },
    ],
  };
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teamMembers",
  });
  function onSubmit(data: any) {
    alert(JSON.stringify(data, null, 2));
  }
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 max-w-full mt-2"
    >
      <div className="space-y-4">
        {fields.map((field: any, index: number) => (
          <div
            key={field.id}
            className="flex flex-col sm:flex-row gap-4 items-end border border-ld p-4 rounded-md"
          >
            <Controller
              control={form.control}
              name={`teamMembers.${index}.name`}
              render={({ field: memberNameField, fieldState }: any) => (
                <Field className="w-full">
                  <FieldLabel>Team Member Name</FieldLabel>

                  <Input placeholder="John Doe" {...memberNameField} />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name={`teamMembers.${index}.role`}
              render={({ field: memberRoleField, fieldState }: any) => (
                <Field className="w-full">
                  <FieldLabel>Role</FieldLabel>

                  <Input placeholder="Developer" {...memberRoleField} />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name={`teamMembers.${index}.email`}
              render={({ field: memberEmailField, fieldState }: any) => (
                <Field className="w-full">
                  <FieldLabel>Email</FieldLabel>

                  <Input
                    placeholder="john.doe@example.com"
                    {...memberEmailField}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {fields.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
                className="mt-2 md:mt-0 "
              >
                <Icon icon="mdi:trash-can-outline" className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      {form.formState.errors.teamMembers && (
        <p className="text-sm font-medium text-destructive mt-2">
          {form.formState.errors.teamMembers.message as any}
        </p>
      )}
      <div className="flex justify-between gap-2">
        <Button type="submit">Submit</Button>
        <Button
          type="button"
          variant="outline"
          className=""
          onClick={() => append({ name: "", role: "", email: "" })}
        >
          <Icon icon="mdi:plus" className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>
    </form>
  );
}

export default EmployeeRepeaterFormCode;
