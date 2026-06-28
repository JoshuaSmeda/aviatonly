import React from "react";

import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
import OrdinaryForm from "@/app/components/form-components/form-layouts/OrdinaryForm";
import InputVariants from "@/app/components/form-components/form-layouts/InputVariants";
import DefaultForm from "@/app/components/form-components/form-layouts/DefaultForm";
import BasicHeaderForm from "@/app/components/form-components/form-layouts/basicheader-form";
import ReadOnlyForm from "@/app/components/form-components/form-layouts/ReadOnlyForm";
import DisableForm from "@/app/components/form-components/form-layouts/DisableForm";
export const metadata: Metadata = {
  title: "Form Layouts",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Form Layout",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Form Layout" items={BCrumb} />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <OrdinaryForm />
        </div>
        <div className="col-span-12">
          <InputVariants />
        </div>
        <div className="col-span-12">
          <DefaultForm />
        </div>
        <div className="col-span-12">
          <BasicHeaderForm />
        </div>
        <div className="col-span-12">
          <ReadOnlyForm />
        </div>
        <div className="col-span-12">
          <DisableForm />
        </div>
      </div>
    </>
  );
};

export default page;
