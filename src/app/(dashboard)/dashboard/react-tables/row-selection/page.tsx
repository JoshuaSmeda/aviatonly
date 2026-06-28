import React from "react";

import { Metadata } from "next";
import ReactEditable from "@/components/dashboard/react-tables/row-selection/page";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";

export const metadata: Metadata = {
    title: "Row Selection Table",
};
const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Row Selection Table",
    },
];
function page() {
    return (
        <>
            <BreadcrumbComp title="Row Selection Table " items={BCrumb} />
            <ReactEditable />
        </>
    );
}

export default page;
