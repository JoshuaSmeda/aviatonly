import { Metadata } from "next";
import React from "react";

import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
import DefaultAvatarDemo from "@/app/components/shadcn-ui/avatar/avatar-01";
import GroupAvatarDemo from "@/app/components/shadcn-ui/avatar/avatar-02";
import BadgeAvatarDemo from "@/app/components/shadcn-ui/avatar/avatar-03";
import BorderAvatarDemo from "@/app/components/shadcn-ui/avatar/avatar-04";
import CounterAvatarDemo from "@/app/components/shadcn-ui/avatar/avatar-05";
import FallbackDemo from "@/app/components/shadcn-ui/avatar/avatar-06";
import CodePreview from "@/app/components/shared/code-preview";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Ui Avatar",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Avatar",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Avatar" items={BCrumb} />

      <div className="grid  sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {/* Basic */}
        <div >
          <CodePreview
            component={<DefaultAvatarDemo />}
            filePath="/app/components/shadcn-ui/avatar/avatar-01.tsx"
            title="Default "
          />
        </div>
        <div >
          <CodePreview
            component={<GroupAvatarDemo />}
            filePath="/app/components/shadcn-ui/avatar/avatar-02.tsx"
            title="Group"
          />
        </div>
        <div >
          <CodePreview
            component={<BadgeAvatarDemo />}
            filePath="/app/components/shadcn-ui/avatar/avatar-03.tsx"
            title="BadgeAvatar"
          />
        </div>
        <div >
          <CodePreview
            component={<BorderAvatarDemo />}
            filePath="/app/components/shadcn-ui/avatar/avatar-04.tsx"
            title="BorderAvatar"
          />
        </div>
        <div >
          <CodePreview
            component={<CounterAvatarDemo />}
            filePath="/app/components/shadcn-ui/avatar/avatar-05.tsx"
            title="CounterAvatar"
          />
        </div>
        <div >
          <CodePreview
            component={<FallbackDemo />}
            filePath="app/components/shadcn-ui/avatar/avatar-06.tsx"
            title="FallbackDemo"
          />
        </div>
      </div>
    </>
  );
};

export default page;
