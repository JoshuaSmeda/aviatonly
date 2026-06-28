import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";

import React from "react";
import { BlogProvider } from "@/app/context/blog-context/index";
import type { Metadata } from "next";
import CategoryTags from "@/app/components/apps/blog/blogedit/category-tags";
import GeneralDetail from "@/app/components/apps/blog/blogedit/general-detail";



import { Button } from "@/components/ui/button";


import PostDate from "@/app/components/apps/blog/blogedit/post-date";
import Media from "@/app/components/apps/blog/blogedit/medias";
import Status from "@/app/components/apps/blog/blogedit/blog-status";




export const metadata: Metadata = {
  title: "Blog Edit",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Blog Edit",
  },
];
const BlogEdit = () => {
  return (
    <>
      <BlogProvider>
        <BreadcrumbComp title="Blog Edit" items={BCrumb} />
        <div className="grid grid-cols-12 gap-[30px]">
          <div className="lg:col-span-8 col-span-12">
            <div className="flex flex-col gap-[30px]">
              {/* General */}
              <GeneralDetail />
              {/* Media  */}
              <Media />
            </div>
          </div>
          <div className="lg:col-span-4 col-span-12">
            <div className="flex flex-col gap-[30px]">
              {/* Status */}
              <Status />
              {/* CategoryTags */}
              <CategoryTags />
              {/* PostDate */}
              <PostDate />
            </div>
          </div>
          <div className="lg:col-span-8 col-span-12">
            <div className="sm:flex gap-3 ">
              <Button className="sm:mb-0 mb-3 w-fit ">Save changes</Button>
              <Button variant={"destructive"}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </BlogProvider>
    </>
  );
};

export default BlogEdit;
