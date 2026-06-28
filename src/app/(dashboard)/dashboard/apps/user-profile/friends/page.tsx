import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";

import FriendsApp from "@/components/dashboard/apps/userprofile/friends";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "User Friends",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Friends",
  },
];

const Friends = () => {
  return (
    <>
      <BreadcrumbComp title="Friends" items={BCrumb} />
      <FriendsApp />
    </>
  );
};

export default Friends;
