"use client";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

function CourseRepeaterFormCode() {
  const formSchema = z.object({
    courses: z
      .array(
        z.object({
          courseName: z
            .string({ required_error: "Course Name is required." })
            .min(1, "Course Name is required."),
          credits: z
            .number({ required_error: "Credits is required." })
            .int("Credits must be an integer.")
            .min(1, "Minimum credits is 1.")
            .max(6, "Maximum credits is 6."),
        }),
      )
      .min(1, "At least one course is required."),
  });
  type FormValues = z.infer<typeof formSchema>;
  const defaultValues: FormValues = {
    courses: [{ courseName: "", credits: 0 }],
  };
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "courses",
  });
  const onSubmit = async (data: any) => {
    alert(JSON.stringify(data, null, 2));
  };
  return (
    <div className="max-w-full mt-2">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col sm:flex-row gap-4 mb-4 p-4 border  border-ld rounded-md"
            >
              <Controller
                control={form.control}
                name={`courses.${index}.courseName`}
                render={({ field: courseNameField, fieldState }: any) => (
                  <Field className="grow">
                    <FieldLabel>Course Name</FieldLabel>

                    <Input
                      placeholder="Introduction to React"
                      {...courseNameField}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name={`courses.${index}.credits`}
                render={({ field: creditsField, fieldState }: any) => (
                  <Field className="w-full sm:w-auto">
                    <FieldLabel>Credits</FieldLabel>

                    <Input
                      type="number"
                      placeholder="3"
                      {...creditsField}
                      value={
                        creditsField.value === undefined ||
                        creditsField.value === null
                          ? ""
                          : String(creditsField.value)
                      }
                      onChange={(event) =>
                        creditsField.onChange(
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
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ courseName: "", credits: 0 })}
                className="mt-auto self-start sm:self-end"
              >
                <Icon icon="lucide:plus" className="h-4 w-4" />
              </Button>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                  className="mt-auto self-start sm:self-end text-white"
                >
                  <Icon icon="lucide:trash" className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          {form.formState.errors.courses && (
            <p className="text-sm font-medium text-destructive mt-2">
              {form.formState.errors.courses?.message as any}
            </p>
          )}
        </div>
        <Button type="submit" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default CourseRepeaterFormCode;
