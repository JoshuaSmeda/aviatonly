import { Metadata } from "next";

import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
import CodePreview from "@/components/dashboard/shared/code-preview";
import WelcomeCard from "@/components/dashboard/shadcn-ui/card/card-04";
import ProductCard from "@/components/dashboard/shadcn-ui/card/card-03";
import PreviewCard from "@/components/dashboard/shadcn-ui/card/card-02";
import AnalyticsCard from "@/components/dashboard/shadcn-ui/card/card-05";
import StatisticsCard from "@/components/dashboard/shadcn-ui/card/card-06";
import ArticlePreviewCard from "@/components/dashboard/shadcn-ui/card/card-01";

export const metadata: Metadata = {
  title: "Ui Card",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Card",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Card" items={BCrumb} />

      <div className="grid cols-12 gap-6">


        <CodePreview title="ArticlePreview " component={<ArticlePreviewCard />} filePath={'/app/components/shadcn-ui/card/card-01.tsx'} />
        <CodePreview title="PreviewCard" component={<PreviewCard />} filePath={'/app/components/shadcn-ui/card/card-02.tsx'} />
        <CodePreview title="ProductCard" component={<ProductCard />} filePath={'/app/components/shadcn-ui/card/card-03.tsx'} />
        <CodePreview title="WelcomeCard" component={<WelcomeCard />} filePath={'/app/components/shadcn-ui/card/card-04.tsx'} />
        <CodePreview title="AnalyticsCard" component={<AnalyticsCard />} filePath={'/app/components/shadcn-ui/card/card-05.tsx'} />
        <CodePreview title="StatisticsCard" component={<StatisticsCard />} filePath={'/app/components/shadcn-ui/card/card-06.tsx'} />

      </div>
    </>
  );
};

export default page;
