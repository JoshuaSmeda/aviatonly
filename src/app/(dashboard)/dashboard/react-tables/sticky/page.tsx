import React from "react";

import { Metadata } from "next";
import StickyTable from "@/components/dashboard/react-tables/sticky/page";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";


export const metadata: Metadata = {
    title: "Sticky Table ",
};
const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Sticky Table",
    },
];
function page() {
    return (
        <>
            <BreadcrumbComp title="Sticky Table" items={BCrumb} />
            <StickyTable />
        </>
    );
}

export default page;
