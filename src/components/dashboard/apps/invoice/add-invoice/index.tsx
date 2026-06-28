"use client";
import { Card } from "@/components/ui/card";
import React from "react";

import { InvoiceProvider } from "@/app/context/invoice-context/index";
import CreateInvoice from "./create";

function CreateInvoiceApp() {
  return (
    <InvoiceProvider>
      <Card className="p-6">
        <CreateInvoice />
      </Card>
    </InvoiceProvider>
  );
}
export default CreateInvoiceApp;
