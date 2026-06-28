"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "border-neutral-200 dark:bg-neutral-200/30 data-checked:bg-neutral-900 data-checked:text-neutral-50 dark:data-checked:bg-neutral-900 data-checked:border-neutral-900 aria-invalid:aria-checked:border-neutral-900 aria-invalid:border-red-500 dark:aria-invalid:border-red-500/50 focus-visible:border-neutral-950 focus-visible:ring-neutral-950/50 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 flex size-4 items-center justify-center rounded-[4px] border transition-colors group-has-disabled/field:opacity-50 focus-visible:ring-[3px] aria-invalid:ring-[3px] peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:dark:bg-neutral-800/30 dark:data-checked:bg-neutral-50 dark:data-checked:text-neutral-900 dark:dark:data-checked:bg-neutral-50 dark:data-checked:border-neutral-50 dark:aria-invalid:aria-checked:border-neutral-50 dark:aria-invalid:border-red-900 dark:dark:aria-invalid:border-red-900/50 dark:focus-visible:border-neutral-300 dark:focus-visible:ring-neutral-300/50 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="[&>svg]:size-3.5 grid place-content-center text-current transition-none"
      >
        <CheckIcon
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
