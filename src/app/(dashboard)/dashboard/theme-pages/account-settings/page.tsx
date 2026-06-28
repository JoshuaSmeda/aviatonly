import AccountSettingIndex from "@/components/dashboard/theme-pages/account-settings";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Account Settings Page",
  description: "Update your account information and settings.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Account Setting",
  },
];
const Accountsettings = () => {
  return (
    <>
      <BreadcrumbComp title="Account Setting" items={BCrumb} />
      <AccountSettingIndex />
    </>
  );
};

export default Accountsettings;
