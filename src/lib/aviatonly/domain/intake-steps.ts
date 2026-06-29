import {
  ClipboardCheck,
  ClipboardList,
  Cog,
  Fan,
  FileText,
  Frame,
  Images,
  Plane,
  Radio,
  Tag,
  UserRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface IntakeStep {
  id: string;
  title: string;
  /** Short summary shown in the step header. */
  description: string;
  icon: LucideIcon;
  /** Hint about what this step will collect. */
  hint: string;
}

/**
 * AVIATONLY aircraft intake flow. This is an intake/review flow, not a direct
 * publish flow — the final action is "Submit for AVIATONLY review".
 */
export const INTAKE_STEPS: IntakeStep[] = [
  {
    id: "listing-type",
    title: "Start & listing type",
    description: "Choose how you'd like to sell and start a draft.",
    icon: ClipboardList,
    hint: "Fixed price vs timed auction selection and draft creation.",
  },
  {
    id: "identity",
    title: "Aircraft identity",
    description: "Registration, make, model, year, and category.",
    icon: Plane,
    hint: "Registration (ZS / ZU), make, model, year, and aircraft category.",
  },
  {
    id: "ownership",
    title: "Ownership & seller details",
    description: "Who owns the aircraft and who is authorised to sell.",
    icon: UserRound,
    hint: "Registered owner, seller role, and authorisation to list.",
  },
  {
    id: "airframe",
    title: "Airframe details",
    description: "TTAF, location, configuration, and damage history.",
    icon: Frame,
    hint: "Total time on airframe, base airfield, province, and damage history.",
  },
  {
    id: "engine",
    title: "Engine details",
    description: "Engine make/model, hours, TSO, and overhaul history.",
    icon: Cog,
    hint: "One or more engines: make/model, hours, time since overhaul.",
  },
  {
    id: "propeller",
    title: "Propeller details",
    description: "Propeller make/model, type, hours, and overhaul history.",
    icon: Fan,
    hint: "Propeller make/model, type, hours, and time since overhaul.",
  },
  {
    id: "avionics",
    title: "Avionics & equipment",
    description: "Avionics suite, IFR capability, and installed equipment.",
    icon: Radio,
    hint: "Avionics suite, IFR/VFR capability, and installed equipment list.",
  },
  {
    id: "maintenance",
    title: "Maintenance status",
    description: "Maintenance status, last MPI date, and known defects.",
    icon: Wrench,
    hint: "Maintenance status, last MPI date, and known defects or snags.",
  },
  {
    id: "photos",
    title: "Guided photo upload",
    description: "Capture the required guided photo angles.",
    icon: Images,
    hint: "Guided photo slots for required angles — not a generic upload box.",
  },
  {
    id: "documents",
    title: "Document vault",
    description: "Upload logbooks and certificates. Private by default.",
    icon: FileText,
    hint: "Logbooks, C of A/ATF, C of R, and W&B — stored private by default.",
  },
  {
    id: "sale",
    title: "Sale setup",
    description: "Pricing, reserve, and sale type configuration.",
    icon: Tag,
    hint: "Asking price, reserve, valuation estimate, and sale type.",
  },
  {
    id: "review",
    title: "Review & submit",
    description: "Review everything and submit for AVIATONLY review.",
    icon: ClipboardCheck,
    hint: "Final review with a completeness summary before submission.",
  },
];

export const INTAKE_STEP_COUNT = INTAKE_STEPS.length;

export function getIntakeStep(index: number): IntakeStep | undefined {
  if (index < 0 || index >= INTAKE_STEP_COUNT) return undefined;
  return INTAKE_STEPS[index];
}
