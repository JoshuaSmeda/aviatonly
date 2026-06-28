import TicketsApp from "@/components/dashboard/apps/tickets";

import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
export const metadata: Metadata = {
  title: "Ticket App",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Tickets",
  },
];
const Tickets = () => {
  return (
    <>
      <BreadcrumbComp title="Tickets App" items={BCrumb} />
      <TicketsApp />
    </>
  );
};

export default Tickets;
