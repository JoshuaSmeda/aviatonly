import CourseRepeaterForm from "@/app/components/form-components/Form-Repeater/courserepeater-form";
import DailyActivityRepeaterForm from "@/app/components/form-components/Form-Repeater/dailyactivityrepeater-form";
import EcommRepeaterForm from "@/app/components/form-components/Form-Repeater/ecommrepeater-form";
import EmployeeRepeaterForm from "@/app/components/form-components/Form-Repeater/employeerepeater-form";
import { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";

export const metadata: Metadata = {
  title: "Form Repeater",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Form Repeater",
  },
];

function page() {
  return (
    <>
      <BreadcrumbComp title="Form Repeater" items={BCrumb} />

      <div className="grid grid-cols-12 gap-5 sm:gap-7">
        {/* Basic */}
        <div className="col-span-12">
          <EcommRepeaterForm />
        </div>
        <div className="col-span-12">
          <CourseRepeaterForm />
        </div>
        <div className="col-span-12">
          <EmployeeRepeaterForm />
        </div>
        <div className="col-span-12">
          <DailyActivityRepeaterForm />
        </div>
      </div>
    </>
  );
}

export default page;
