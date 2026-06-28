import ChatsApp from "@/components/dashboard/apps/chat";


import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
export const metadata: Metadata = {
  title: "Chat App",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Chat",
  },
];
const Chats = () => {
  return (
    <>
      <BreadcrumbComp title="Chat App" items={BCrumb} />
      <ChatsApp />
    </>
  );
};

export default Chats;
