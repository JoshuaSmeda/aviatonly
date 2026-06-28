"use client";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

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
import { Switch } from "@/components/ui/switch";
import { Icon } from "@iconify/react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

function RegistrationFormCode() {
  const formSchema = z.object({
    fullName: z
      .string({ required_error: "Full Name is required." })
      .min(1, "Full Name is required."),
    email: z
      .string({ required_error: "Email is required." })
      .email("Invalid email address."),
    age: z
      .number({ required_error: "Age is required." })
      .int("Age must be an integer.")
      .min(18, "You must be at least 18 years old."),
    address: z.object({
      street: z
        .string({ required_error: "Street address is required." })
        .min(1, "Street address is required."),
      city: z
        .string({ required_error: "City is required." })
        .min(1, "City is required."),
      zipCode: z
        .string({ required_error: "ZIP Code is required." })
        .regex(/^\d{5}$/, "ZIP Code must be 5 digits."),
    }),
    phoneNumbers: z
      .array(
        z
          .string({ required_error: "Phone number is required." })
          .min(1, "Phone number cannot be empty."),
      )
      .min(1, "At least one phone number is required."),
    employmentType: z.enum(["Full-time", "Part-time", "Contract"], {
      required_error: "Please select an employment type.",
    }),
    skills: z.array(z.string()).min(1, "Please select at least one skill."),
    openToRemote: z.boolean().default(false),
  });
  const defaultValues = {
    fullName: "",
    email: "",
    age: 0,
    address: {
      street: "",
      city: "",
      zipCode: "",
    },
    phoneNumbers: [""],
    employmentType: "Full-time",
    skills: [],
    openToRemote: false,
  };
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "phoneNumbers",
  });
  const onSubmit = (data: any) => {
    alert(JSON.stringify(data, null, 2));
  };
  const skillsOptions = [
    "React",
    "Node.js",
    "TypeScript",
    "AWS",
    "Docker",
    "Kubernetes",
    "SQL",
    "NoSQL",
  ];
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit as any)}
      className="max-w-full space-y-8 mt-3"
    >
      <div className="grid grid-cols-12 gap-4 ">
        <div className="lg:col-span-6 col-span-12">
          <Controller
            control={form.control}
            name="fullName"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Full Name</FieldLabel>

                <Input placeholder="John Doe" {...field} />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="lg:col-span-6 cols-span-12">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }: any) => (
              <Field>
                <FieldLabel>Email</FieldLabel>

                <Input placeholder="john.doe@example.com" {...field} />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <Controller
            control={form.control}
            name="age"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Age</FieldLabel>

                <Input
                  type="number"
                  placeholder="30"
                  {...field}
                  value={
                    field.value === undefined || field.value === null
                      ? ""
                      : String(field.value)
                  }
                  onChange={(event: any) =>
                    field.onChange(
                      event.target.value === ""
                        ? undefined
                        : +event.target.value,
                    )
                  }
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <Controller
            control={form.control}
            name={`phoneNumber`}
            render={({ field, fieldState }) => (
              <Field className="grow">
                <FieldLabel>Phone Number</FieldLabel>

                <Input placeholder="555-123-4567" {...field} />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>
      <div>
        <h3 className="mb-4 text-lg font-medium">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 col-span-1">
            <Controller
              control={form.control}
              name="address.street"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Street Address</FieldLabel>

                  <Input placeholder="123 Main St" {...field} />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Controller
            control={form.control}
            name="address.city"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>City</FieldLabel>

                <Input placeholder="Anytown" {...field} />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="address.zipCode"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>ZIP Code</FieldLabel>

                <Input placeholder="12345" {...field} />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>
      <div>
        <h3 className="mb-4 text-lg font-medium">Job Preferences</h3>
        <Controller
          control={form.control}
          name="employmentType"
          render={({ field, fieldState }: any) => (
            <Field>
              <FieldLabel>Employment Type</FieldLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue>{"Select an employment type"}</SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="skills"
          render={() => (
            <Field className="mt-4">
              <FieldLabel>Skills</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {skillsOptions.map((skill: string) => (
                  <Controller
                    key={skill}
                    control={form.control}
                    name="skills"
                    render={({ field, fieldState }) => (
                      <Field className="flex flex-row">
                        <FieldGroup className="flex flex-row items-center gap-2 ">
                          <Checkbox
                            checked={field.value?.includes(skill)}
                            onCheckedChange={(checked: boolean) => {
                              return checked
                                ? field.onChange([...field.value, skill])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: any) => value !== skill,
                                    ),
                                  );
                            }}
                          />
                          <FieldLabel className="font-normal">
                            {skill}
                          </FieldLabel>
                        </FieldGroup>
                      </Field>
                    )}
                  />
                ))}
              </div>

              {form.formState.errors.skills && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.skills.message as any}
                </p>
              )}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="openToRemote"
          render={({ field, fieldState }) => (
            <Field className="flex flex-row items-center justify-between rounded-lg border border-ld p-4 mt-6">
              <FieldLabel className="text-base">Open to Remote Work</FieldLabel>

              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="m-0"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Button type="submit">Submit Application</Button>
    </form>
  );
}

export default RegistrationFormCode;
