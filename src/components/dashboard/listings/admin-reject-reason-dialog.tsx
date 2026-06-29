"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { INTAKE_REJECTION_PRESETS } from "@/lib/aviatonly/domain";
import { cn } from "@/lib/utils";

export interface RejectReasonResult {
  presetId: string;
  customReason: string;
}

interface AdminRejectReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: (result: RejectReasonResult) => void;
  isPending?: boolean;
}

const AdminRejectReasonDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isPending = false,
}: AdminRejectReasonDialogProps) => {
  const [presetId, setPresetId] = useState<string>(INTAKE_REJECTION_PRESETS[0].id);
  const [customReason, setCustomReason] = useState("");

  const needsCustom = presetId === "other";
  const canConfirm = needsCustom ? customReason.trim().length > 0 : true;

  const handleConfirm = () => {
    onConfirm({ presetId, customReason: customReason.trim() });
    setCustomReason("");
    setPresetId(INTAKE_REJECTION_PRESETS[0].id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel>Reason</FieldLabel>
            <FieldDescription>Select the closest issue. Add detail if needed.</FieldDescription>
            <div className="flex flex-wrap gap-2">
              {INTAKE_REJECTION_PRESETS.map((preset) => (
                <Badge
                  key={preset.id}
                  variant={presetId === preset.id ? "default" : "outline"}
                  className={cn("cursor-pointer")}
                  onClick={() => setPresetId(preset.id)}
                >
                  {preset.label}
                </Badge>
              ))}
            </div>
          </Field>

          {needsCustom || presetId !== "other" ? (
            <Field>
              <FieldLabel htmlFor="reject-note">Additional detail</FieldLabel>
              <Textarea
                id="reject-note"
                rows={3}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder={
                  needsCustom
                    ? "Describe what the seller must fix…"
                    : "Optional extra detail for the seller…"
                }
              />
            </Field>
          ) : null}
        </FieldGroup>

        <DialogFooter>
          <Button variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isPending || !canConfirm}
            onClick={handleConfirm}
          >
            Mark not approved
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminRejectReasonDialog;
