import { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
import AnimatedTabMotion from "@/app/components/shadcn-ui/tabs/tabs-01";
import TransitionTabMotion from "@/app/components/shadcn-ui/tabs/tabs-02";
import TabsWithIconDemo from "@/app/components/shadcn-ui/tabs/tabs-03";
import TabsWithCount from "@/app/components/shadcn-ui/tabs/tabs-04";
import CodePreview from "@/app/components/shared/code-preview";


export const metadata: Metadata = {
  title: "Ui Tab",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Tab",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Tab" items={BCrumb} />
      <div className="grid  gap-6">
        <CodePreview
          component={<AnimatedTabMotion />}
          filePath="/app/components/shadcn-ui/tab/tabs-01.tsx"
          title="Animated Tab Motion"
        />
        <CodePreview
          component={<TransitionTabMotion />}
          filePath="/app/components/shadcn-ui/tab/tabs-02.tsx"
          title="Transition Tab Motion"
        />
        <CodePreview
          component={<TabsWithIconDemo />}
          filePath="/app/components/shadcn-ui/tab/tabs-03.tsx"
          title="Tabs With Icon"
        />
        <CodePreview
          component={<TabsWithCount />}
          filePath="/app/components/shadcn-ui/tab/tabs-04.tsx"
          title="Tabs With Count"
        />


      </div>
    </>
  );
};

export default page;
