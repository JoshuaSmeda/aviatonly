import type { LeadMessageView } from "@/lib/aviatonly/server/lead-messages";
import {
  getLeadThreadDetail,
  markLeadThreadRead,
  queryLeadMessages,
} from "@/lib/aviatonly/server/lead-messages";
import { AuthorizationError } from "@/lib/aviatonly/server/authorization";

export interface LeadWorkspaceMessageContext {
  messages: LeadMessageView[];
  canSendMessage: boolean;
  canReply: boolean;
  inboxHref: string;
}

export async function loadLeadWorkspaceMessageContext(input: {
  leadId: string;
  viewerId: string;
  canManage: boolean;
  isAdmin?: boolean;
  markRead?: boolean;
  inboxBasePath?: string;
}): Promise<LeadWorkspaceMessageContext | null> {
  const inboxBasePath = input.inboxBasePath ?? "/dashboard/seller/messages";

  try {
    if (input.isAdmin) {
      const messages = await queryLeadMessages(input.leadId, input.viewerId, {
        isAdmin: true,
      });
      return {
        messages,
        canSendMessage: false,
        canReply: false,
        inboxHref: `${inboxBasePath}/${input.leadId}`,
      };
    }

    const detail = await getLeadThreadDetail(input.leadId, input.viewerId);
    if (!detail || detail.viewerRole !== "seller") {
      return null;
    }

    const messages = await queryLeadMessages(input.leadId, input.viewerId);

    if (input.markRead) {
      await markLeadThreadRead(input.leadId, input.viewerId);
    }

    return {
      messages,
      canSendMessage: detail.canSendMessage,
      canReply: input.canManage,
      inboxHref: `${inboxBasePath}/${input.leadId}`,
    };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return null;
    }
    throw error;
  }
}
