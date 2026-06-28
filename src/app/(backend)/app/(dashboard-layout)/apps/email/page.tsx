import EmaiilApp from "@/app/components/apps/email";

import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
export const metadata: Metadata = {
  title: "Email App",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Email",
  },
];
const Emaiil = () => {
  return (
    <>
      <BreadcrumbComp title="Email App" items={BCrumb} />
      <EmaiilApp />
    </>
  );
};
export default Emaiil;
