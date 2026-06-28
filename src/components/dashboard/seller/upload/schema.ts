import * as z from "zod";

export const REGISTRATION_TYPES = ["ZU", "ZS"] as const;
export const SALE_TYPES = ["FIXED_PRICE", "AUCTION"] as const;

const currentYear = new Date().getFullYear();

/**
 * Full seller intake schema for an aircraft listing.
 *
 * Numeric fields are kept as `number | undefined` (not coerced) so that an empty
 * input reads as "not provided" rather than `0`. Inputs must use the
 * empty-string -> undefined onChange pattern.
 */
export const aircraftSchema = z
  .object({
    // Step 1 — Basic details
    registration: z
      .string({ required_error: "Registration is required." })
      .trim()
      .min(1, "Registration is required.")
      .regex(
        /^Z[SU]-[A-Z]{3}$/i,
        "Use SACAA format, e.g. ZS-ABC or ZU-XYZ.",
      ),
    registrationType: z.enum(REGISTRATION_TYPES, {
      required_error: "Select a registration type.",
    }),
    make: z.string({ required_error: "Make is required." }).trim().min(1, "Make is required."),
    model: z.string({ required_error: "Model is required." }).trim().min(1, "Model is required."),
    year: z
      .number({
        required_error: "Year is required.",
        invalid_type_error: "Year is required.",
      })
      .int("Enter a valid year.")
      .min(1900, "Enter a valid year.")
      .max(currentYear + 1, "Year can't be in the future."),
    category: z.string({ required_error: "Select an aircraft category." }).min(1, "Select an aircraft category."),
    airfield: z
      .string({ required_error: "Base airfield is required." })
      .trim()
      .min(1, "Base airfield is required."),
    province: z.string({ required_error: "Select a province." }).min(1, "Select a province."),

    // Step 2 — Technical details
    ttaf: z
      .number({ invalid_type_error: "Total time must be a number." })
      .min(0, "Total time can't be negative.")
      .max(100000, "Enter a realistic airframe time."),
    engineMakeModel: z
      .string({ required_error: "Engine make/model is required." })
      .trim()
      .min(1, "Engine make/model is required."),
    engineHours: z
      .number({ invalid_type_error: "Engine hours must be a number." })
      .min(0, "Engine hours can't be negative."),
    tso: z.number({ invalid_type_error: "TSO must be a number." }).min(0, "TSO can't be negative.").optional(),
    propellerMakeModel: z.string().trim().optional(),
    propellerHours: z
      .number({ invalid_type_error: "Propeller hours must be a number." })
      .min(0, "Propeller hours can't be negative.")
      .optional(),
    avionics: z.string().trim().optional(),
    maintenanceStatus: z.string().optional(),
    lastMpiDate: z.date().optional(),
    knownDefects: z.string().trim().optional(),

    // Step 5 — Pricing & sale type
    saleType: z.enum(SALE_TYPES, { required_error: "Select how you want to sell." }),
    valuationEstimate: z.number({ invalid_type_error: "Estimate must be a number." }).min(0).optional(),
    askingPrice: z.number({ invalid_type_error: "Asking price must be a number." }).min(0).optional(),
    reservePrice: z.number({ invalid_type_error: "Reserve must be a number." }).min(0).optional(),
    startingBid: z.number({ invalid_type_error: "Starting bid must be a number." }).min(0).optional(),
    bidIncrement: z.number({ invalid_type_error: "Bid increment must be a number." }).min(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.saleType === "FIXED_PRICE") {
      if (data.askingPrice == null || data.askingPrice <= 0) {
        ctx.addIssue({
          path: ["askingPrice"],
          code: z.ZodIssueCode.custom,
          message: "Asking price is required for a fixed-price listing.",
        });
      }
    }
    if (data.saleType === "AUCTION") {
      if (data.startingBid == null || data.startingBid <= 0) {
        ctx.addIssue({
          path: ["startingBid"],
          code: z.ZodIssueCode.custom,
          message: "A starting bid is required for an auction.",
        });
      }
      if (data.bidIncrement == null || data.bidIncrement <= 0) {
        ctx.addIssue({
          path: ["bidIncrement"],
          code: z.ZodIssueCode.custom,
          message: "A bid increment is required for an auction.",
        });
      }
    }
  });

export type AircraftFormValues = z.infer<typeof aircraftSchema>;

export const aircraftDefaultValues: Partial<AircraftFormValues> = {
  registration: "",
  registrationType: undefined,
  make: "",
  model: "",
  year: undefined,
  category: "",
  airfield: "",
  province: "",
  ttaf: undefined,
  engineMakeModel: "",
  engineHours: undefined,
  tso: undefined,
  propellerMakeModel: "",
  propellerHours: undefined,
  avionics: "",
  maintenanceStatus: undefined,
  lastMpiDate: undefined,
  knownDefects: "",
  saleType: "FIXED_PRICE",
  valuationEstimate: undefined,
  askingPrice: undefined,
  reservePrice: undefined,
  startingBid: undefined,
  bidIncrement: undefined,
};

/**
 * Fields validated when advancing past each step. Steps 3 (photos) and 4
 * (documents) are intentionally empty — uploads are optional for the prototype.
 */
export const STEP_FIELDS: (keyof AircraftFormValues)[][] = [
  ["registration", "registrationType", "make", "model", "year", "category", "airfield", "province"],
  ["ttaf", "engineMakeModel", "engineHours", "tso", "propellerHours"],
  [],
  [],
  ["saleType", "askingPrice", "startingBid", "bidIncrement", "reservePrice", "valuationEstimate"],
  [],
];
