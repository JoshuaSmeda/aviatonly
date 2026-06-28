import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
import InputValidationOne from "@/app/components/form-components/form-validation/input-validationone";
import InputValidationTwo from "@/app/components/form-components/form-validation/input-validationtwo";
import OnLeaveValidation from "@/app/components/form-components/form-validation/onleave-validation";
import SelectValidation from "@/app/components/form-components/form-validation/select-validation";
import RadioValidation from "@/app/components/form-components/form-validation/radio-validation";
import CheckBoxValidation from "@/app/components/form-components/form-validation/checkbox-validation";
export const metadata: Metadata = {
  title: "Form Validation",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Form Validation",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Form Validation" items={BCrumb} />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <InputValidationOne />
        </div>
        <div className="col-span-12">
          <InputValidationTwo />
        </div>
        <div className="col-span-12">
          <OnLeaveValidation />
        </div>
        <div className="col-span-12">
          <SelectValidation />
        </div>
        <div className="col-span-12">
          <RadioValidation />
        </div>
        <div className="col-span-12">
          <CheckBoxValidation />
        </div>
      </div>
    </>
  );
};

export default page;
