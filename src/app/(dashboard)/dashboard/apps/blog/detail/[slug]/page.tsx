import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import BlogDetailData from "@/components/dashboard/apps/blog/detail";
import React from "react";
import { BlogProvider } from "@/app/context/blog-context/index";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Blog Details",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Blog Detail",
  },
];
const BlogDetail = () => {
  return (
    <>
      <BlogProvider>
        <BreadcrumbComp title="Blog Detail" items={BCrumb} />
        <BlogDetailData />
      </BlogProvider>
    </>
  );
};

export default BlogDetail;
