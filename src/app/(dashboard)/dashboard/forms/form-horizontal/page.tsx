import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import BasicLayout from "@/components/dashboard/form-components/form-horizontal/basic-layout";
import FormSeprator from "@/components/dashboard/form-components/form-horizontal/form-seprator";
import FormLableAlignment from "@/components/dashboard/form-components/form-horizontal/formlable-alignment";
import CollapsibalForm from "@/components/dashboard/form-components/form-horizontal/collapsibal-form";
import FormWithTabs from "@/components/dashboard/form-components/form-horizontal/formwith-tabs";
export const metadata: Metadata = {
  title: "Form Horizontal",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Form Horizontal",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Form Horizontal" items={BCrumb} />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <BasicLayout />
        </div>
        <div className="col-span-12">
          <FormSeprator />
        </div>
        <div className="col-span-12">
          <FormLableAlignment />
        </div>
        <div className="col-span-12">
          <CollapsibalForm />
        </div>
        <div className="col-span-12">
          <FormWithTabs />
        </div>
      </div>
    </>
  );
};

export default page;
