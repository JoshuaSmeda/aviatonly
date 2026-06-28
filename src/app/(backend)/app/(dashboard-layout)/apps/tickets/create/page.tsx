import CreateTicketForm from "@/app/components/apps/tickets/create-ticketform";
import type { Metadata } from "next";

import { TicketProvider } from "@/app/context/ticket-context/index";
import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";

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
const CreateTickets = () => {
  return (
    <>
      <BreadcrumbComp title="Tickets App" items={BCrumb} />
      <TicketProvider>
        <CreateTicketForm />
      </TicketProvider>
    </>
  );
};

export default CreateTickets;
