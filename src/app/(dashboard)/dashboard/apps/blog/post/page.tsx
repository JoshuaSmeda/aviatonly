import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import BlogPost from "@/components/dashboard/apps/blog/blog-post";

import { Metadata } from "next";
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Blog app",
  },
];
export const metadata: Metadata = {
  title: "Blog Post",
};
const Blog = () => {
  return (
    <>
      <BreadcrumbComp title="Blog app" items={BCrumb} />
      <BlogPost />
    </>
  );
};
export default Blog;
