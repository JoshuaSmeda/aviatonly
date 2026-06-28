"use client";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

function EcommRepeaterFormCode() {
  const itemSchema = z.object({
    itemName: z
      .string({ required_error: "Item Name is required." })
      .min(1, "Item Name cannot be empty."),
    quantity: z
      .number({ required_error: "Quantity is required." })
      .int("Quantity must be an integer.")
      .min(1, "Quantity must be at least 1."),
    unitPrice: z
      .number({ required_error: "Unit Price is required." })
      .min(0.01, "Unit Price must be positive."),
  });
  const formSchema = z.object({
    items: z.array(itemSchema).min(1, "At least one item is required."),
  });
  const defaultValues = {
    items: [{ itemName: "", quantity: 1, unitPrice: 0.01 }],
  };
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  const onSubmit = (data: any) => {
    alert(JSON.stringify(data, null, 2));
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 max-w-full mt-2"
    >
      <div>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col sm:flex-row gap-4 mb-4 p-4 border rounded-md"
          >
            <Controller
              control={form.control}
              name={`items.${index}.itemName`}
              render={({ field: itemField, fieldState }: any) => (
                <Field className="w-full">
                  <FieldLabel>Item Name</FieldLabel>

                  <Input placeholder="e.g., Laptop" {...itemField} />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name={`items.${index}.quantity`}
              render={({ field: itemField, fieldState }: any) => (
                <Field className="w-full">
                  <FieldLabel>Quantity</FieldLabel>

                  <Input
                    type="number"
                    placeholder="1"
                    {...itemField}
                    value={
                      itemField.value === undefined || itemField.value === null
                        ? ""
                        : String(itemField.value)
                    }
                    onChange={(event) =>
                      itemField.onChange(
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
            <Controller
              control={form.control}
              name={`items.${index}.unitPrice`}
              render={({ field: itemField, fieldState }: any) => (
                <Field className="w-full">
                  <FieldLabel>Unit Price</FieldLabel>

                  <Input
                    type="number"
                    placeholder="100.00"
                    {...itemField}
                    value={
                      itemField.value === undefined || itemField.value === null
                        ? ""
                        : String(itemField.value)
                    }
                    onChange={(event) =>
                      itemField.onChange(
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
            <div className="flex gap-2 items-end">
              <Button
                onClick={() =>
                  append({ itemName: "", quantity: 1, unitPrice: 0.01 })
                }
                variant="outline"
                className="w-fit"
              >
                <Icon icon="lucide:plus" className="h-4 w-4" />
              </Button>
              {fields.length > 1 && (
                <Button onClick={() => remove(index)} variant={"destructive"}>
                  <Icon icon="lucide:trash-2" className="h-4 w-4 " />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm font-medium text-destructive mt-2">
        {form.formState.errors.items?.message as any}
      </p>
      <div className="flex items-center gap-4">
        <Button type="submit" className="w-fit">
          Submit
        </Button>
      </div>
    </form>
  );
}

export default EcommRepeaterFormCode;
