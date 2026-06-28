import { Metadata } from "next";

import ButtonWithIconDemo from "@/components/dashboard/shadcn-ui/button/button-01";
import ButtonShinyTextDemo from "@/components/dashboard/shadcn-ui/button/button-02";
import ButtonShineHoverDemo from "@/components/dashboard/shadcn-ui/button/button-03";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
import ButtonHeartbeatEffectDemo from "@/components/dashboard/shadcn-ui/button/button-04";
import ButtonFigmaDemo from "@/components/dashboard/shadcn-ui/button/button-05";
import ButtonAnimatedBorderDemo from "@/components/dashboard/shadcn-ui/button/button-06";
import ButtonSocialDemo from "@/components/dashboard/shadcn-ui/button/button-07";
import ButtonSocialIconDemo from "@/components/dashboard/shadcn-ui/button/button-08";
import ButtonOutlineWithIconDemo from "@/components/dashboard/shadcn-ui/button/button-09";
import ButtonSaveDemo from "@/components/dashboard/shadcn-ui/button/button-10";
import ButtonCancelDemo from "@/components/dashboard/shadcn-ui/button/button-11";
import ButtonDefaultDemo from "@/components/dashboard/shadcn-ui/button/button-12";
import ButtonSizeDemoxs from "@/components/dashboard/shadcn-ui/button/button-13";
import ButtonSizeDemosm from "@/components/dashboard/shadcn-ui/button/button-14";
import ButtonSizeDemolg from "@/components/dashboard/shadcn-ui/button/button-15";
import CodePreview from "@/components/dashboard/shared/code-preview";

export const metadata: Metadata = {
  title: "Ui Button",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Button",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Button" items={BCrumb} />
      <div className="grid sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {/* Basic */}

        <CodePreview
          component={<ButtonWithIconDemo />}
          filePath="/app/components/shadcn-ui/button/button-01.tsx"
          title="Button With Icon"
        />


        <CodePreview
          component={<ButtonShinyTextDemo />}
          filePath="/app/components/shadcn-ui/button/button-02.tsx"
          title="Button Shiny Text "
        />


        <CodePreview
          component={<ButtonShineHoverDemo />}
          filePath="/app/components/shadcn-ui/button/button-03.tsx"
          title="Button ShineHover "
        />


        <CodePreview
          component={<ButtonHeartbeatEffectDemo />}
          filePath="/app/components/shadcn-ui/button/button-04.tsx"
          title="Button HeartbeatEffect"
        />


        <CodePreview
          component={<ButtonFigmaDemo />}
          filePath="/app/components/shadcn-ui/button/button-05.tsx"
          title="Button Figma"
        />


        <CodePreview
          component={<ButtonAnimatedBorderDemo />}
          filePath="/app/components/shadcn-ui/button/button-06.tsx"
          title="Button AnimatedBorder"
        />
        {" "}


        <CodePreview
          component={<ButtonSocialIconDemo />}
          filePath="/app/components/shadcn-ui/button/button-08.tsx"
          title="Button Social Icon "
        />


        <CodePreview
          component={<ButtonOutlineWithIconDemo />}
          filePath="/app/components/shadcn-ui/button/button-09.tsx"
          title="Button OutlineWithIcon "
        />


        <CodePreview
          component={<ButtonSaveDemo />}
          filePath="/app/components/shadcn-ui/button/button-10.tsx"
          title="Button Save "
        />


        <CodePreview
          component={<ButtonCancelDemo />}
          filePath="/app/components/shadcn-ui/button/button-11.tsx"
          title="Button Cancel"
        />


        <CodePreview
          component={<ButtonDefaultDemo />}
          filePath="/app/components/shadcn-ui/button/button-12.tsx"
          title="Button Default"
        />


        <CodePreview
          component={<ButtonSizeDemoxs />}
          filePath="/app/components/shadcn-ui/button/button-13.tsx"
          title="Button Size xs "
        />


        <CodePreview
          component={<ButtonSizeDemosm />}
          filePath="/app/components/shadcn-ui/button/button-14.tsx"
          title="Button Size sm "
        />


        <CodePreview
          component={<ButtonSizeDemolg />}
          filePath="/app/components/shadcn-ui/button/button-15.tsx"
          title="Button Size lg "
        />


        <CodePreview
          component={<ButtonSocialDemo />}
          filePath="/app/components/shadcn-ui/button/button-07.tsx"
          title="Button Social"
        />

      </div>

    </>
  );
};

export default page;
