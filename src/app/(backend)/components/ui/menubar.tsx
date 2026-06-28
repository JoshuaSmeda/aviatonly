"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckIcon } from "lucide-react"

function Menubar({ className, ...props }: MenubarPrimitive.Props) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn("bg-white h-8 gap-0.5 rounded-lg border border-neutral-200 p-1 flex items-center dark:bg-neutral-950 dark:border-neutral-800", className)}
      {...props}
    />
  )
}

function MenubarMenu({ ...props }: React.ComponentProps<typeof DropdownMenu>) {
  return <DropdownMenu data-slot="menubar-menu" {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuGroup>) {
  return <DropdownMenuGroup data-slot="menubar-group" {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPortal>) {
  return <DropdownMenuPortal data-slot="menubar-portal" {...props} />
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuTrigger>) {
  return (
    <DropdownMenuTrigger
      data-slot="menubar-trigger"
      className={cn(
        "hover:bg-neutral-100 aria-expanded:bg-neutral-100 rounded-sm px-1.5 py-px text-sm font-medium flex items-center outline-hidden select-none dark:hover:bg-neutral-800 dark:aria-expanded:bg-neutral-800",
        className
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="menubar-content"
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn("bg-white text-neutral-950 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-neutral-950/10 min-w-36 rounded-lg p-1 shadow-md ring-1 duration-100 dark:bg-neutral-950 dark:text-neutral-50 dark:ring-neutral-50/10", className)}
      {...props}
    />
  )
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuItem>) {
  return (
    <DropdownMenuItem
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn("focus:bg-neutral-100 focus:text-neutral-900 data-[variant=destructive]:text-red-500 data-[variant=destructive]:focus:bg-red-500/10 dark:data-[variant=destructive]:focus:bg-red-500/20 data-[variant=destructive]:focus:text-red-500 data-[variant=destructive]:*:[svg]:!text-destructive not-data-[variant=destructive]:focus:**:text-neutral-900 gap-1.5 rounded-md px-1.5 py-1 text-sm data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg:not([class*='size-'])]:size-4 group/menubar-item dark:focus:bg-neutral-800 dark:focus:text-neutral-50 dark:data-[variant=destructive]:text-red-900 dark:data-[variant=destructive]:focus:bg-red-900/10 dark:dark:data-[variant=destructive]:focus:bg-red-900/20 dark:data-[variant=destructive]:focus:text-red-900 dark:not-data-[variant=destructive]:focus:**:text-neutral-50", className)}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "focus:bg-neutral-100 focus:text-neutral-900 focus:**:text-neutral-900 gap-1.5 rounded-md py-1 pr-1.5 pl-7 text-sm data-disabled:opacity-50 relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 dark:focus:bg-neutral-800 dark:focus:text-neutral-50 dark:focus:**:text-neutral-50",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="left-1.5 size-4 [&_svg:not([class*='size-'])]:size-4 pointer-events-none absolute flex items-center justify-center">
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon
          />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuRadioGroup>) {
  return <DropdownMenuRadioGroup data-slot="menubar-radio-group" {...props} />
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "focus:bg-neutral-100 focus:text-neutral-900 focus:**:text-neutral-900 gap-1.5 rounded-md py-1 pr-1.5 pl-7 text-sm data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 dark:focus:bg-neutral-800 dark:focus:text-neutral-50 dark:focus:**:text-neutral-50",
        className
      )}
      {...props}
    >
      <span className="left-1.5 size-4 [&_svg:not([class*='size-'])]:size-4 pointer-events-none absolute flex items-center justify-center">
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon
          />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuLabel>) {
  return (
    <DropdownMenuLabel
      data-slot="menubar-label"
      data-inset={inset}
      className={cn("px-1.5 py-1 text-sm font-medium data-[inset]:pl-8", className)}
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSeparator>) {
  return (
    <DropdownMenuSeparator
      data-slot="menubar-separator"
      className={cn("bg-neutral-200 -mx-1 my-1 h-px dark:bg-neutral-800", className)}
      {...props}
    />
  )
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuShortcut>) {
  return (
    <DropdownMenuShortcut
      data-slot="menubar-shortcut"
      className={cn("text-neutral-500 group-focus/menubar-item:text-accent-foreground text-xs tracking-widest ml-auto dark:text-neutral-400", className)}
      {...props}
    />
  )
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuSub>) {
  return <DropdownMenuSub data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuSubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuSubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn("focus:bg-neutral-100 focus:text-neutral-900 data-open:bg-neutral-100 data-open:text-neutral-900 gap-1.5 rounded-md px-1.5 py-1 text-sm data-[inset]:pl-8 [&_svg:not([class*='size-'])]:size-4 dark:focus:bg-neutral-800 dark:focus:text-neutral-50 dark:data-open:bg-neutral-800 dark:data-open:text-neutral-50", className)}
      {...props}
    />
  )
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSubContent>) {
  return (
    <DropdownMenuSubContent
      data-slot="menubar-sub-content"
      className={cn("bg-white text-neutral-950 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-neutral-950/10 min-w-32 rounded-lg p-1 shadow-lg ring-1 duration-100 dark:bg-neutral-950 dark:text-neutral-50 dark:ring-neutral-50/10", className)}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
