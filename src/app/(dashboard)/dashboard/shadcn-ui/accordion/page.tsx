import React from "react";

import type { Metadata } from "next";

import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
import Accordion01 from "@/components/dashboard/shadcn-ui/accordion/accordion01";
import Accordion02 from "@/components/dashboard/shadcn-ui/accordion/accordion02";
import CodePreview from "@/components/dashboard/shared/code-preview";
export const metadata: Metadata = {
  title: "Ui Accordion",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Accordion",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Accordion" items={BCrumb} />
      <div className="grid grid-cols-12 gap-7">
        <div className="col-span-12">
          <CodePreview
            component={<Accordion01 />}
            filePath="app/components/shadcn-ui/accordion/accordion01.tsx"
            title="Accordion"
          />
        </div>

        <div className="col-span-12">
          <CodePreview
            component={<Accordion02 />}
            filePath="app/components/shadcn-ui/accordion/accordion02.tsx"
            title="Accordion MultiLevel"
          />
        </div>
      </div>
    </>
  );
};

export default page;
