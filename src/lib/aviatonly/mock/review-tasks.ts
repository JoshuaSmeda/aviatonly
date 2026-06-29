import { ReviewTaskStatus } from "@/lib/aviatonly/domain";
import type { MockListingReviewTask } from "./types";

const T = "2026-06-29T08:00:00.000Z";

export const MOCK_REVIEW_TASKS: MockListingReviewTask[] = [
  {
    id: "task-zs-abc-photos",
    listingId: "zs-abc",
    title: "Replace blurry propeller leading edge photo",
    description: "Upload a closer shot showing each blade tip and leading edge nicks.",
    assignedToId: "user-seller-demo",
    assignedRole: "SELLER",
    status: ReviewTaskStatus.WAITING_ON_SELLER,
    dueDate: "2026-07-05T00:00:00.000Z",
    blockingPublication: true,
    createdById: "user-admin-reviewer",
    resolvedById: null,
    resolvedAt: null,
    createdAt: "2026-06-28T11:00:00.000Z",
    updatedAt: T,
  },
  {
    id: "task-zs-abc-cockpit",
    listingId: "zs-abc",
    title: "Upload cockpit panel photo powered on",
    description: "Instrument panel must be powered on with gauges readable.",
    assignedToId: "user-seller-demo",
    assignedRole: "SELLER",
    status: ReviewTaskStatus.WAITING_ON_SELLER,
    dueDate: "2026-07-05T00:00:00.000Z",
    blockingPublication: true,
    createdById: "user-admin-reviewer",
    resolvedById: null,
    resolvedAt: null,
    createdAt: "2026-06-28T11:05:00.000Z",
    updatedAt: T,
  },
  {
    id: "task-zs-abc-mpi",
    listingId: "zs-abc",
    title: "Upload the latest MPI stamp",
    description: "Scan or photograph the most recent Mandatory Periodic Inspection stamp.",
    assignedToId: "user-seller-demo",
    assignedRole: "SELLER",
    status: ReviewTaskStatus.WAITING_ON_SELLER,
    dueDate: "2026-07-05T00:00:00.000Z",
    blockingPublication: true,
    createdById: "user-admin-reviewer",
    resolvedById: null,
    resolvedAt: null,
    createdAt: "2026-06-28T11:10:00.000Z",
    updatedAt: T,
  },
  {
    id: "task-zu-xyz-reserve",
    listingId: "zu-xyz",
    title: "Confirm reserve price for auction",
    description: "Seller must confirm the reserve before AVIATONLY approves the timed auction.",
    assignedToId: "user-seller-demo",
    assignedRole: "SELLER",
    status: ReviewTaskStatus.WAITING_ON_SELLER,
    dueDate: "2026-07-02T00:00:00.000Z",
    blockingPublication: true,
    createdById: "user-admin-reviewer",
    resolvedById: null,
    resolvedAt: null,
    createdAt: "2026-06-27T15:20:00.000Z",
    updatedAt: T,
  },
  {
    id: "task-zs-mno-valuation",
    listingId: "zs-mno",
    title: "Run pre-valuation review",
    description: "Complete internal valuation before scheduling inspection.",
    assignedToId: "user-admin-reviewer",
    assignedRole: "ADMIN",
    status: ReviewTaskStatus.IN_PROGRESS,
    dueDate: "2026-07-01T00:00:00.000Z",
    blockingPublication: true,
    createdById: "user-admin-reviewer",
    resolvedById: null,
    resolvedAt: null,
    createdAt: "2026-06-29T06:30:00.000Z",
    updatedAt: T,
  },
  {
    id: "task-zs-def-offers",
    listingId: "zs-def",
    title: "Review pending buyer offers",
    description: "Two offers awaiting seller response.",
    assignedToId: "user-seller-demo",
    assignedRole: "SELLER",
    status: ReviewTaskStatus.OPEN,
    dueDate: "2026-07-03T00:00:00.000Z",
    blockingPublication: false,
    createdById: "user-admin-reviewer",
    resolvedById: null,
    resolvedAt: null,
    createdAt: "2026-06-28T16:00:00.000Z",
    updatedAt: T,
  },
];

export function getMockReviewTasksForListing(listingId: string): MockListingReviewTask[] {
  return MOCK_REVIEW_TASKS.filter((t) => t.listingId === listingId);
}

export function getOpenReviewTasksForListing(listingId: string): MockListingReviewTask[] {
  return MOCK_REVIEW_TASKS.filter(
    (t) =>
      t.listingId === listingId &&
      t.status !== ReviewTaskStatus.DONE &&
      t.status !== ReviewTaskStatus.CANCELLED,
  );
}
