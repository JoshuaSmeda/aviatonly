import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";

import UserProfileApp from "@/components/dashboard/apps/userprofile/profile";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "User Profile App",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "User Profile",
  },
];
const UserProfile = () => {
  return (
    <>
      <BreadcrumbComp title="User Profile" items={BCrumb} />
      <UserProfileApp />
    </>
  );
};

export default UserProfile;
