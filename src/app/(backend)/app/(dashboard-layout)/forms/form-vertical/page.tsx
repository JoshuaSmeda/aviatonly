import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
import BasicLayout from "@/app/components/form-components/form-vertical/basic-layout";
import MulticolFormSeprator from "@/app/components/form-components/form-vertical/multicolform-seprator";
import CollapsibleSection from "@/app/components/form-components/form-vertical/collapsible-section";
import FormWithTabs from "@/app/components/form-components/form-vertical/formwith-tabs";
export const metadata: Metadata = {
  title: "Form Vertical",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Form Vertical",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Form Vertical" items={BCrumb} />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <BasicLayout />
        </div>
        <div className="col-span-12">
          <MulticolFormSeprator />
        </div>
        <div className="col-span-12">
          <CollapsibleSection />
        </div>
        <div className="col-span-12">
          <FormWithTabs />
        </div>
      </div>
    </>
  );
};

export default page;
