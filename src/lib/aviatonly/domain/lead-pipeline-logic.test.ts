import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DEMO_SELLER_ID } from "@/lib/aviatonly/mock/users";
import { buildLeadPipelineBoardFromMock } from "@/lib/aviatonly/mock/selectors";
import { LeadStatus, PIPELINE_LEAD_STATUSES } from "./lead-status";
import {
  assertSellerScopedLead,
  buildLeadPipelineBoard,
  isLeadFollowUpOverdue,
} from "./lead-pipeline-logic";

describe("lead-pipeline-logic", () => {
  it("groups leads into pipeline columns in stage order", () => {
    const board = buildLeadPipelineBoard([
      { id: "1", status: LeadStatus.QUALIFIED },
      { id: "2", status: LeadStatus.NEW },
      { id: "3", status: LeadStatus.CONTACTED },
    ]);

    assert.deepEqual(
      board.columns.map((column) => column.status),
      [...PIPELINE_LEAD_STATUSES],
    );
    assert.equal(board.columns[0]?.items[0]?.id, "2");
    assert.equal(board.columns[1]?.items[0]?.id, "3");
    assert.equal(board.columns[2]?.items[0]?.id, "1");
    assert.equal(board.totalActive, 3);
  });

  it("excludes archived statuses from pipeline columns", () => {
    const board = buildLeadPipelineBoard([
      { id: "closed", status: LeadStatus.CLOSED },
      { id: "lost", status: LeadStatus.UNQUALIFIED },
      { id: "active", status: LeadStatus.NEW },
    ]);

    assert.equal(board.totalActive, 3);
    assert.equal(board.columns[0]?.items.length, 1);
    assert.equal(board.columns[0]?.items[0]?.id, "active");
  });

  it("flags overdue follow-ups", () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    assert.equal(isLeadFollowUpOverdue(yesterday), true);
    assert.equal(isLeadFollowUpOverdue(null), false);
  });

  it("rejects leads outside seller scope", () => {
    assert.throws(
      () => assertSellerScopedLead({ sellerId: "seller-b" }, "seller-a"),
      /outside the seller scope/,
    );
  });

  it("mock pipeline board respects seller scope", () => {
    const demoBoard = buildLeadPipelineBoardFromMock({ sellerId: DEMO_SELLER_ID });
    const otherSellerBoard = buildLeadPipelineBoardFromMock({ sellerId: "user-seller-elaine" });

    assert.ok(demoBoard.totalActive > 0);
    assert.ok(otherSellerBoard.totalActive < demoBoard.totalActive);
    assert.equal(otherSellerBoard.totalActive, 1);
    assert.equal(otherSellerBoard.columns[0]?.items[0]?.id, "lead-13");
  });
});
