import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
import React from "react";
import { BlogProvider } from "@/app/context/blog-context/index";
import type { Metadata } from "next";
import ManageBlogTable from "@/app/components/apps/blog/blogtable/manage-blogtable";


export const metadata: Metadata = {
  title: "Manage Blog ",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Manage Blog",
  },
];
const MangeBlog = () => {
  return (
    <>
      <BlogProvider>
        <BreadcrumbComp title=" Manage Blog" items={BCrumb} />

        <ManageBlogTable />
      </BlogProvider>
    </>
  );
};

export default MangeBlog;
