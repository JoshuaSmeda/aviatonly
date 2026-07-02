import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  canSendLeadMessage,
  canUserPostLeadMessage,
  isReusableLeadStatus,
  resolveLeadThreadParticipantRole,
} from "./lead-message-logic";
import { LeadStatus } from "./lead-status";

const lead = {
  buyerId: "buyer-1",
  sellerId: "seller-1",
  status: LeadStatus.NEW,
};

describe("lead-message-logic", () => {
  it("treats closed and unqualified leads as non-messagable", () => {
    assert.equal(canSendLeadMessage(LeadStatus.CLOSED), false);
    assert.equal(canSendLeadMessage(LeadStatus.UNQUALIFIED), false);
    assert.equal(canSendLeadMessage(LeadStatus.NEW), true);
    assert.equal(canSendLeadMessage(LeadStatus.OFFER_MADE), true);
  });

  it("reuses only non-terminal lead statuses", () => {
    assert.equal(isReusableLeadStatus(LeadStatus.QUALIFIED), true);
    assert.equal(isReusableLeadStatus(LeadStatus.CLOSED), false);
  });

  it("resolves buyer and seller participant roles", () => {
    assert.equal(resolveLeadThreadParticipantRole(lead, "buyer-1"), "buyer");
    assert.equal(resolveLeadThreadParticipantRole(lead, "seller-1"), "seller");
    assert.equal(resolveLeadThreadParticipantRole(lead, "other-1"), null);
  });

  it("allows buyer and seller to post on open leads", () => {
    assert.equal(canUserPostLeadMessage(lead, "buyer-1"), true);
    assert.equal(canUserPostLeadMessage(lead, "seller-1"), true);
    assert.equal(canUserPostLeadMessage(lead, "other-1"), false);
  });

  it("blocks posting on closed leads even for participants", () => {
    const closedLead = { ...lead, status: LeadStatus.CLOSED };
    assert.equal(canUserPostLeadMessage(closedLead, "buyer-1"), false);
    assert.equal(canUserPostLeadMessage(closedLead, "seller-1"), false);
  });

  it("allows admins to post on open leads", () => {
    assert.equal(canUserPostLeadMessage(lead, "admin-1", { isAdmin: true }), true);
  });
});
