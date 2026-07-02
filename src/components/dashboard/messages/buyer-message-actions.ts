"use client";

import { sendBuyerLeadMessageAction } from "@/app/(dashboard)/dashboard/messages/actions";
import type { SendLeadMessageFn } from "@/components/dashboard/messages/lead-message-composer";

export const sendBuyerLeadMessage: SendLeadMessageFn = async (leadId, body) =>
  sendBuyerLeadMessageAction(leadId, body);
