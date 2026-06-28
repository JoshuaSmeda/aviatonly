
import { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
import CodePreview from "@/app/components/shared/code-preview";
import HoverCardTooltipDemo from "@/app/components/shadcn-ui/tooltip/tooltip-01";
import ContentTooltipDemo from "@/app/components/shadcn-ui/tooltip/tooltip-02";
import AnimatedTooltipMotion from "@/app/components/shadcn-ui/tooltip/tooltip-03";
import RoundedTooltipDemo from "@/app/components/shadcn-ui/tooltip/tooltip-04";
import TooltipDirectionsDemo from "@/app/components/shadcn-ui/tooltip/tooltip-05";
import AvatarGroupTooltipDemo from "@/app/components/shadcn-ui/tooltip/tooltip-06";
import ErrorTooltipDemo from "@/app/components/shadcn-ui/tooltip/tooltip-07";

export const metadata: Metadata = {
  title: "Ui Tooltip",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Tooltip",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Tooltip" items={BCrumb} />
      <div className="grid grid-cols-12 gap-6 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
        {/* Basic */}
        <div >
          <CodePreview
            filePath="/app/components/shadcn-ui/tooltip/tooltip-01.tsx"
            component={<HoverCardTooltipDemo />}
            title="Basic Tooltip"
          />
        </div>
        <div >
          <CodePreview
            filePath="/app/components/shadcn-ui/tooltip/tooltip-02.tsx"
            component={<ContentTooltipDemo />}
            title="Content Tooltip"
          />
        </div>
        <div>
          <CodePreview
            filePath="/app/components/shadcn-ui/tooltip/tooltip-03.tsx"
            component={<AnimatedTooltipMotion />}
            title="Animated Tooltip"
          />
        </div>
        <div>
          <CodePreview
            filePath="/app/components/shadcn-ui/tooltip/tooltip-04.tsx"
            component={<RoundedTooltipDemo />}
            title="Rounded Tooltip"
          />
        </div>
        <div>
          <CodePreview
            filePath="/app/components/shadcn-ui/tooltip/tooltip-05.tsx"
            component={<TooltipDirectionsDemo />}
            title="Tooltip Directions"
          />
        </div>
        <div>
          <CodePreview
            filePath="/app/components/shadcn-ui/tooltip/tooltip-06.tsx"
            component={<AvatarGroupTooltipDemo />}
            title="Avatar Group Tooltip"
          />
        </div>
        <div>
          <CodePreview
            filePath="/app/components/shadcn-ui/tooltip/tooltip-07.tsx"
            component={<ErrorTooltipDemo />}
            title="ErrorTooltip Tooltip"
          />
        </div>
      </div>
    </>
  );
};

export default page;
