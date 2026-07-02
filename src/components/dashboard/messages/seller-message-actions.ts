"use client";

import { sendSellerLeadMessageAction } from "@/app/(dashboard)/dashboard/seller/messages/actions";
import type { SendLeadMessageFn } from "@/components/dashboard/messages/lead-message-composer";

export const sendSellerLeadMessage: SendLeadMessageFn = async (leadId, body) =>
  sendSellerLeadMessageAction(leadId, body);
