import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
import BlogPost from "@/app/components/apps/blog/blog-post";

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
