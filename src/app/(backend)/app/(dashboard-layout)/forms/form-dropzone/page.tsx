import { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
import AnimatedDropzone from "@/app/components/form-components/form-dropzone/animated-dropzone";
import DefaultDropzone from "@/app/components/form-components/form-dropzone/default-dropzone";

export const metadata: Metadata = {
  title: "Form Dropzone",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Dropzone",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Dropzone" items={BCrumb} />
      <div className="flex flex-col gap-6">
        <div>
          <DefaultDropzone />
        </div>
        <div>
          <AnimatedDropzone />
        </div>
      </div>
    </>
  );
};

export default page;
