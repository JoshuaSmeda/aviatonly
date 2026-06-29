/** Must stay in sync with `EnginePosition` in `prisma/schema.prisma`. */
export enum EnginePosition {
  SINGLE = "SINGLE",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  FRONT = "FRONT",
  REAR = "REAR",
}

/** Must stay in sync with `PropellerType` in `prisma/schema.prisma`. */
export enum PropellerType {
  FIXED_PITCH = "FIXED_PITCH",
  CONSTANT_SPEED = "CONSTANT_SPEED",
  VARIABLE_PITCH = "VARIABLE_PITCH",
  OTHER = "OTHER",
}

/** Must stay in sync with `SaleType` in `prisma/schema.prisma`. */
export enum SaleType {
  FIXED_PRICE = "FIXED_PRICE",
  AUCTION = "AUCTION",
}

export const SALE_TYPE_LABELS: Record<SaleType, string> = {
  [SaleType.FIXED_PRICE]: "Fixed price",
  [SaleType.AUCTION]: "Timed auction",
};
