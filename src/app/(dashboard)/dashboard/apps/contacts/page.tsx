import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";

import ContactApp from "@/components/dashboard/apps/contacts/index";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact App",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Contact",
  },
];
const Contacts = () => {
  return (
    <>
      <BreadcrumbComp title="Contact App" items={BCrumb} />
      <ContactApp />
    </>
  );
};

export default Contacts;
