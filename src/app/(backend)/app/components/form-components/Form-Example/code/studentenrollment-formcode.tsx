"use client";
import React from "react";
import { useForm, useFieldArray, Form, Controller } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Icon } from "@iconify/react";

function StudentEnrollmentFormCode() {
  const formSchema = z.object({
    name: z
      .string({ required_error: "Name is required." })
      .min(2, "Name must be at least 2 characters."),
    email: z
      .string({ required_error: "Email is required." })
      .email("Invalid email address."),
    dateOfBirth: z
      .date({ required_error: "Date of birth is required." })
      .max(new Date(), "Date of birth cannot be in the future.")
      .refine((date) => {
        const today = new Date();
        const eighteenYearsAgo = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate(),
        );
        return date <= eighteenYearsAgo;
      }, "Student must be at least 18 years old."),
    parentGuardian: z.object({
      parentName: z
        .string({ required_error: "Parent/Guardian name is required." })
        .min(2, "Name must be at least 2 characters."),
      parentPhone: z
        .string({ required_error: "Parent/Guardian phone is required." })
        .regex(
          /^\+?[0-9]{7,15}$/,
          "Invalid phone number format. E.g., +1234567890",
        ),
    }),
    subjects: z
      .array(
        z.object({
          name: z
            .string({ required_error: "Subject name is required." })
            .min(1, "Subject name cannot be empty."),
        }),
      )
      .min(1, { message: "At least one subject is required." }),
    gradeLevel: z.enum(
      [
        "Kindergarten",
        "1st Grade",
        "2nd Grade",
        "3rd Grade",
        "4th Grade",
        "5th Grade",
        "6th Grade",
        "7th Grade",
        "8th Grade",
        "9th Grade",
        "10th Grade",
        "11th Grade",
        "12th Grade",
      ],
      {
        required_error: "Please select a grade level.",
      },
    ),
    agreeToTerms: z
      .boolean({ required_error: "You must agree to the terms." })
      .refine((val) => val === true, "You must agree to the terms."),
  });
  const defaultValues = {
    name: "",
    email: "",
    dateOfBirth: new Date(
      new Date().setFullYear(new Date().getFullYear() - 18),
    ), // Default to 18 years ago
    parentGuardian: {
      parentName: "",
      parentPhone: "",
    },
    subjects: [{ name: "" }],
    gradeLevel: "1st Grade" as "1st Grade", // Initialize with a valid enum member
    agreeToTerms: false,
  };
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subjects",
  });
  const onSubmit = (data: any) => {
    alert(JSON.stringify(data, null, 2));
  };
  const gradeLevels = [
    "Kindergarten",
    "1st Grade",
    "2nd Grade",
    "3rd Grade",
    "4th Grade",
    "5th Grade",
    "6th Grade",
    "7th Grade",
    "8th Grade",
    "9th Grade",
    "10th Grade",
    "11th Grade",
    "12th Grade",
  ];
  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-3">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            {/* Student Name */}
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }: any) => (
                <Field>
                  <FieldLabel>Student Name</FieldLabel>

                  <Input placeholder="John Doe" {...field} />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Student Email */}
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }: any) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          {/* Date of Birth */}
          <Controller
            control={form.control}
            name="dateOfBirth"
            render={({ field, fieldState }: any) => (
              <Field className="flex flex-col">
                <FieldLabel>Date of Birth</FieldLabel>
                <Popover>
                  <PopoverTrigger>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Icon
                        icon="lucide:calendar"
                        className="ml-auto h-4 w-4 opacity-50"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Parent/Guardian Details */}
          <fieldset className="space-y-4 border border-ld p-4 rounded-md">
            <legend className="text-lg font-semibold px-2">
              Parent/Guardian Details
            </legend>
            <Controller
              control={form.control}
              name="parentGuardian.parentName"
              render={({ field, fieldState }: any) => (
                <Field>
                  <FieldLabel>Parent/Guardian Name</FieldLabel>

                  <Input placeholder="Jane Doe" {...field} />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="parentGuardian.parentPhone"
              render={({ field, fieldState }: any) => (
                <Field>
                  <FieldLabel>Parent/Guardian Phone</FieldLabel>

                  <Input type="tel" placeholder="+1234567890" {...field} />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </fieldset>
          {/* Dynamic Subjects */}
          <fieldset className="space-y-4 border border-ld  p-4 rounded-md">
            <legend className="text-lg font-semibold px-2">Subjects</legend>
            {fields.map((item: any, index: number) => (
              <Controller
                control={form.control}
                key={item.id}
                name={`subjects.${index}.name`}
                render={({ field, fieldState }: any) => (
                  <Field>
                    <FieldLabel>Subject {index + 1}</FieldLabel>
                    <div className="flex items-center space-x-2">
                      <Input placeholder="Mathematics" {...field} />

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ name: "" })}
                      >
                        <Icon icon="lucide:plus" className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <Icon icon="lucide:trash-2" className="h-4 w-4" />
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ))}
            {form.formState.errors.subjects &&
              typeof (form.formState.errors.subjects as any).message ===
                "string" && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {(form.formState.errors.subjects as any).message}
                </p>
              )}
          </fieldset>
          {/* Grade Level Select */}
          <Controller
            control={form.control}
            name="gradeLevel"
            render={({ field, fieldState }: any) => (
              <Field>
                <FieldLabel>Grade Level</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue>{"Select a grade level"}</SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {gradeLevels.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Agree to Terms Checkbox */}
          <Controller
            control={form.control}
            name="agreeToTerms"
            render={({ field, fieldState }: any) => (
              <Field className="flex flex-row items-start gap-3 space-y-0 rounded-md border border-ld p-3">
                <FieldGroup className="flex flex-row items-center gap-2 ">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />

                  <FieldLabel className="mb-0">
                    I agree to the terms and conditions
                  </FieldLabel>
                </FieldGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit" className="w-full">
            Submit Enrollment
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default StudentEnrollmentFormCode;
