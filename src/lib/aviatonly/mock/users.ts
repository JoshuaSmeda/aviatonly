import { UserRole } from "@/lib/aviatonly/domain";
import type { MockUser } from "./types";

export const DEMO_SELLER_ID = "user-demo";

export const MOCK_USERS: MockUser[] = [
  {
    id: DEMO_SELLER_ID,
    email: "user@aviatonly.co.za",
    name: "AVIATONLY User",
    roles: [UserRole.SELLER, UserRole.BUYER],
    phone: "+27 82 451 9032",
    province: "Gauteng",
    verificationStatus: "VERIFIED",
    createdAt: "2025-11-01T08:00:00.000Z",
    updatedAt: "2026-06-20T14:30:00.000Z",
  },
  {
    id: "user-admin",
    email: "admin@aviatonly.co.za",
    name: "AVIATONLY Admin",
    roles: [UserRole.ADMIN],
    verificationStatus: "VERIFIED",
    createdAt: "2025-08-01T08:00:00.000Z",
    updatedAt: "2026-06-29T07:00:00.000Z",
  },
];

export const MOCK_SELLERS = MOCK_USERS.filter((u) => u.roles.includes(UserRole.SELLER));
export const MOCK_BUYERS = MOCK_USERS.filter((u) => u.roles.includes(UserRole.BUYER));

export function getMockUserById(id: string): MockUser | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}
