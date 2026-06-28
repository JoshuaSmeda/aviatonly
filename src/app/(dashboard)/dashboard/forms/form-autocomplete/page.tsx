import { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import { DefaultAutocomplete } from "@/components/dashboard/form-components/form-autocomplete/default-autocomplete";
import CommandAutocomplete from "@/components/dashboard/form-components/form-autocomplete/command-autocomplete";

export const metadata: Metadata = {
  title: "Form Autocomplete",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Autocomplete",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Autocomplete" items={BCrumb} />
      <div className="flex flex-col gap-6">
        <div>
          <DefaultAutocomplete />
        </div>
        <div>
          <CommandAutocomplete />
        </div>
      </div>
    </>
  );
};

export default page;
