import type { Metadata } from "next";
import { ChatAIProvider } from "@/app/context/aichat-context";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
import ChatAppAi from "@/components/dashboard/apps/chat-ai";

export const metadata: Metadata = {
  title: "Chat-AI",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Chat-AI",
  },
];
const ChatAi = () => {
  return (
    <>
      <ChatAIProvider>
        <BreadcrumbComp title="Chat-AI" items={BCrumb} />
        <ChatAppAi />
      </ChatAIProvider>
    </>
  );
};

export default ChatAi;
