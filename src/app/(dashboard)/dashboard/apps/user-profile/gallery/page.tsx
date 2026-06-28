import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";

import GalleryApp from "@/components/dashboard/apps/userprofile/gallery";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "User Gallery",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Gallery",
  },
];
const Gallery = () => {
  return (
    <>
      <BreadcrumbComp title="Gallery" items={BCrumb} />
      <GalleryApp />
    </>
  );
};

export default Gallery;
