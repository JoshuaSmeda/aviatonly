import { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import DefaultSelect2 from "@/components/dashboard/form-components/form-select2/default-select2";
import MultiSelect2 from "@/components/dashboard/form-components/form-select2/multi-select2";

export const metadata: Metadata = {
  title: "Form Select2",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Select2",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Select2" items={BCrumb} />
      <div className="flex flex-col gap-6">
        <div>
          <DefaultSelect2 />
        </div>
        <div>
          <MultiSelect2 />
        </div>
      </div>
    </>
  );
};

export default page;
