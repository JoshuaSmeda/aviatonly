"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
] as const;

interface LeadFollowUpPickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const next = new Date(date);
  next.setHours(hours, minutes, 0, 0);
  return next;
}

const LeadFollowUpPicker = ({ value, onChange, disabled }: LeadFollowUpPickerProps) => {
  const [time, setTime] = useState<string>(() =>
    value ? format(value, "HH:mm") : "09:00",
  );

  const dateOnly = useMemo(
    () => (value ? new Date(value.getFullYear(), value.getMonth(), value.getDate()) : undefined),
    [value],
  );

  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) {
      onChange(undefined);
      return;
    }
    onChange(combineDateAndTime(selected, time));
  };

  const handleTimeChange = (nextTime: string | null) => {
    if (!nextTime) return;
    setTime(nextTime);
    if (dateOnly) {
      onChange(combineDateAndTime(dateOnly, nextTime));
    }
  };

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="lead-follow-up-date">Follow-up date</FieldLabel>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                id="lead-follow-up-date"
                type="button"
                variant="outline"
                disabled={disabled}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateOnly && "text-muted-foreground",
                )}
              >
                <CalendarIcon data-icon="inline-start" />
                {dateOnly ? format(dateOnly, "PPP") : "Pick a date"}
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateOnly}
              onSelect={handleDateSelect}
              captionLayout="dropdown"
              defaultMonth={dateOnly ?? new Date()}
              disabled={{ before: new Date() }}
            />
          </PopoverContent>
        </Popover>
      </Field>

      <Field>
        <FieldLabel htmlFor="lead-follow-up-time">Time</FieldLabel>
        <Select value={time} onValueChange={handleTimeChange} disabled={disabled || !dateOnly}>
          <SelectTrigger id="lead-follow-up-time" className="w-full">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {TIME_SLOTS.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldDescription>South African local time.</FieldDescription>
      </Field>
    </FieldGroup>
  );
};

export default LeadFollowUpPicker;
