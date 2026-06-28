import type { Metadata } from "next";
import GeneralDetail from "@/app/components/apps/blog/blogadd/general-detail";



import CategoryTags from "@/app/components/apps/blog/blogadd/category-tags";
import PostDate from "@/app/components/apps/blog/blogadd/post-date";

import { Button } from "@/components/ui/button";
import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
import Media from "@/app/components/apps/blog/blogadd/medias";
import Status from "@/app/components/apps/blog/blogadd/blog-status";



export const metadata: Metadata = {
  title: "Blog Create",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Blog Create",
  },
];
const BlogCreate = () => {
  return (
    <>
      <BreadcrumbComp title="Blog Create" items={BCrumb} />
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
          <div className="sm:flex gap-3">
            <Button className="sm:mb-0 mb-3 w-fit ">Add Blog</Button>
            <Button variant={"destructive"}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogCreate;
