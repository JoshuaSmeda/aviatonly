import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { LeadStatus } from "./lead-status";
import {
  LeadClosedReasonRequiredError,
  LeadTransitionError,
  canTransitionLeadStatus,
  validateLeadStatusTransition,
} from "./lead-transitions";

describe("lead-transitions", () => {
  it("allows same-status no-op transitions", () => {
    assert.equal(canTransitionLeadStatus(LeadStatus.NEW, LeadStatus.NEW), true);
    assert.equal(canTransitionLeadStatus(LeadStatus.CLOSED, LeadStatus.CLOSED), true);
  });

  it("allows forward pipeline moves from NEW", () => {
    assert.equal(canTransitionLeadStatus(LeadStatus.NEW, LeadStatus.CONTACTED), true);
    assert.equal(canTransitionLeadStatus(LeadStatus.NEW, LeadStatus.QUALIFIED), true);
    assert.equal(canTransitionLeadStatus(LeadStatus.NEW, LeadStatus.VIEWING_REQUESTED), true);
  });

  it("rejects illegal backward jumps", () => {
    assert.equal(canTransitionLeadStatus(LeadStatus.QUALIFIED, LeadStatus.NEW), false);
    assert.equal(canTransitionLeadStatus(LeadStatus.OFFER_MADE, LeadStatus.CONTACTED), false);
  });

  it("blocks transitions out of CLOSED", () => {
    assert.equal(canTransitionLeadStatus(LeadStatus.CLOSED, LeadStatus.NEW), false);
    assert.equal(canTransitionLeadStatus(LeadStatus.CLOSED, LeadStatus.CONTACTED), false);
  });

  it("throws LeadTransitionError for illegal drag targets", () => {
    assert.throws(
      () =>
        validateLeadStatusTransition({
          fromStatus: LeadStatus.OFFER_MADE,
          toStatus: LeadStatus.NEW,
        }),
      LeadTransitionError,
    );
  });

  it("requires closedReason when closing a lead", () => {
    assert.throws(
      () =>
        validateLeadStatusTransition({
          fromStatus: LeadStatus.CONTACTED,
          toStatus: LeadStatus.CLOSED,
        }),
      LeadClosedReasonRequiredError,
    );

    assert.doesNotThrow(() =>
      validateLeadStatusTransition({
        fromStatus: LeadStatus.CONTACTED,
        toStatus: LeadStatus.CLOSED,
        closedReason: "Buyer purchased elsewhere.",
      }),
    );
  });

  it("skips transition validation for same-status updates", () => {
    assert.doesNotThrow(() =>
      validateLeadStatusTransition({
        fromStatus: LeadStatus.CLOSED,
        toStatus: LeadStatus.CLOSED,
      }),
    );
  });
});
