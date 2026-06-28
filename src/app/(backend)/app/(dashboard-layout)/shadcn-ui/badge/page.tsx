import { Metadata } from "next";

import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
import CodePreview from "@/app/components/shared/code-preview";
import BadgeDemo from "@/app/components/shadcn-ui/badge/badge-01";
import CountBadgeDemo from "@/app/components/shadcn-ui/badge/badge-02";
import OutlineBadgeDemo from "@/app/components/shadcn-ui/badge/badge-03";
import BadgeWithIconDemo from "@/app/components/shadcn-ui/badge/badge-04";
import BadgeLinkDemo from "@/app/components/shadcn-ui/badge/badge-05";
import ErrorBadgeDemo from "@/app/components/shadcn-ui/badge/badge-06";

export const metadata: Metadata = {
  title: "Ui Badge",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Badge",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Badges" items={BCrumb} />
      <div className="grid  sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {/* Basic */}
        <div >
          <CodePreview
            component={<BadgeDemo />}
            filePath="/app/components/shadcn-ui/badge/badge-01.tsx"
            title="Badge"
          />
        </div>
        <div >
          <CodePreview
            component={<CountBadgeDemo />}
            filePath="/app/components/shadcn-ui/badge/badge-02.tsx"
            title="Count Badge "
          />
        </div>
        <div >
          <CodePreview
            component={<OutlineBadgeDemo />}
            filePath="/app/components/shadcn-ui/badge/badge-03.tsx"
            title="Outline Badge "
          />
        </div>
        <div >
          <CodePreview
            component={<BadgeWithIconDemo />}
            filePath="/app/components/shadcn-ui/badge/badge-04.tsx"
            title="Badge With Icon "
          />
        </div>
        <div >
          <CodePreview
            component={<BadgeLinkDemo />}
            filePath="/app/components/shadcn-ui/badge/badge-05.tsx"
            title="Badge Link"
          />
        </div>
        <div >
          <CodePreview
            component={<ErrorBadgeDemo />}
            filePath="/app/components/shadcn-ui/badge/badge-06.tsx"
            title="Error Badge "
          />
        </div>
      </div>
    </>
  );
};

export default page;
