
import Questions from "@/components/dashboard/theme-pages/faq/faq-questions";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";

import StillHaveQst from "@/components/dashboard/theme-pages/faq/still-haveqst";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "FAQ Page",
  description: "Frequently asked questions and answers.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "FAQ",
  },
];

const faq = () => {
  return (
    <>
      <BreadcrumbComp title="FAQ" items={BCrumb} />
      <Questions />
      <StillHaveQst />
    </>
  );
};

export default faq;
