import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertValidLeadMessageBody,
  LeadMessageValidationError,
  LEAD_MESSAGE_MAX_LENGTH,
  normalizeLeadMessageBody,
} from "./lead-message";

describe("lead-message validation", () => {
  it("trims message body", () => {
    assert.equal(normalizeLeadMessageBody("  hello  "), "hello");
  });

  it("rejects empty messages", () => {
    assert.throws(
      () => assertValidLeadMessageBody("   "),
      (error: unknown) => error instanceof LeadMessageValidationError,
    );
  });

  it("accepts valid messages", () => {
    assert.equal(assertValidLeadMessageBody("  Interested in ZS-ABC.  "), "Interested in ZS-ABC.");
  });

  it("rejects messages over max length", () => {
    const tooLong = "a".repeat(LEAD_MESSAGE_MAX_LENGTH + 1);
    assert.throws(
      () => assertValidLeadMessageBody(tooLong),
      (error: unknown) => error instanceof LeadMessageValidationError,
    );
  });
});
