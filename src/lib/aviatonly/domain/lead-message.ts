export const LEAD_MESSAGE_MIN_LENGTH = 1;
export const LEAD_MESSAGE_MAX_LENGTH = 5000;

export class LeadMessageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LeadMessageValidationError";
  }
}

export function normalizeLeadMessageBody(body: string): string {
  return body.trim();
}

export function assertValidLeadMessageBody(body: string): string {
  const normalized = normalizeLeadMessageBody(body);

  if (normalized.length < LEAD_MESSAGE_MIN_LENGTH) {
    throw new LeadMessageValidationError("Message cannot be empty.");
  }

  if (normalized.length > LEAD_MESSAGE_MAX_LENGTH) {
    throw new LeadMessageValidationError(
      `Message cannot exceed ${LEAD_MESSAGE_MAX_LENGTH} characters.`,
    );
  }

  return normalized;
}
