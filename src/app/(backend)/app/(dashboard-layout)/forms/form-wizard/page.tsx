import EcommFormWizard from "@/app/components/form-components/form-wizard/ecommform-wizard";
import HealthCareWizardForm from "@/app/components/form-components/form-wizard/healthcarewizard-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Wizard",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Form Wizard",
  },
];

function page() {
  return (
    <div className="grid grid-cols-12 gap-5 sm:gap-7">
      {/* Basic */}
      <div className="col-span-12">
        <EcommFormWizard />
      </div>
      <div className="col-span-12">
        <HealthCareWizardForm />
      </div>
    </div>
  );
}

export default page;
