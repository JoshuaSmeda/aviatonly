import { UserRole } from "@/lib/aviatonly/domain";
import type { MockUser } from "./types";

export const DEMO_SELLER_ID = "user-seller-demo";

export const MOCK_USERS: MockUser[] = [
  {
    id: DEMO_SELLER_ID,
    email: "demo-seller@aviatonly.co.za",
    name: "Johan van der Merwe",
    roles: [UserRole.SELLER],
    phone: "+27 82 451 9032",
    province: "Gauteng",
    verificationStatus: "VERIFIED",
    createdAt: "2025-11-01T08:00:00.000Z",
    updatedAt: "2026-06-20T14:30:00.000Z",
  },
  {
    id: "user-seller-elaine",
    email: "elaine.m@aviatonly.co.za",
    name: "Elaine Mokoena",
    roles: [UserRole.SELLER, UserRole.BROKER],
    phone: "+27 83 220 1144",
    province: "Western Cape",
    verificationStatus: "VERIFIED",
    createdAt: "2025-09-15T10:00:00.000Z",
    updatedAt: "2026-06-10T09:00:00.000Z",
  },
  {
    id: "user-buyer-marcus",
    email: "marcus.t@example.co.za",
    name: "Marcus Theron",
    roles: [UserRole.BUYER],
    phone: "+27 84 900 2211",
    province: "Gauteng",
    verificationStatus: "VERIFIED",
    createdAt: "2026-01-20T11:00:00.000Z",
    updatedAt: "2026-06-28T16:00:00.000Z",
  },
  {
    id: "user-buyer-sarah",
    email: "sarah.k@example.co.za",
    name: "Sarah Khumalo",
    roles: [UserRole.BUYER],
    phone: "+27 71 334 8890",
    province: "Western Cape",
    verificationStatus: "VERIFIED",
    createdAt: "2026-02-05T09:30:00.000Z",
    updatedAt: "2026-06-27T10:15:00.000Z",
  },
  {
    id: "user-buyer-james",
    email: "james.w@example.co.za",
    name: "James Whitfield",
    roles: [UserRole.BUYER],
    province: "KwaZulu-Natal",
    verificationStatus: "PENDING",
    createdAt: "2026-05-12T14:00:00.000Z",
    updatedAt: "2026-06-25T08:45:00.000Z",
  },
  {
    id: "user-buyer-peter",
    email: "peter.n@example.co.za",
    name: "Peter Naidoo",
    roles: [UserRole.BUYER],
    phone: "+27 79 112 4455",
    province: "Gauteng",
    verificationStatus: "VERIFIED",
    createdAt: "2026-03-08T10:00:00.000Z",
    updatedAt: "2026-06-28T12:00:00.000Z",
  },
  {
    id: "user-admin-reviewer",
    email: "review@aviatonly.co.za",
    name: "AVIATONLY Ops",
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
