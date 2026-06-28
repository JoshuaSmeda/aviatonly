import RegistrationForm from "@/components/dashboard/form-components/Form-Example/registration-form";
import StudentEnrollmentForm from "@/components/dashboard/form-components/Form-Example/studentenrollment-form";
import { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";

export const metadata: Metadata = {
  title: "Form Example",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Form Example",
  },
];

function page() {
  return (
    <>
      <BreadcrumbComp title="Form Example" items={BCrumb} />

      <div className="grid grid-cols-12 gap-7">
        <div className=" col-span-12">
          <RegistrationForm />
        </div>
        <div className=" col-span-12">
          <StudentEnrollmentForm />
        </div>
      </div>
    </>
  );
}

export default page;
