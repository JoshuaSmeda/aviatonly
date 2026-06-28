"use client";
import React, { useContext, useEffect, useState } from "react";
import { InvoiceContext } from "@/app/context/invoice-context/index";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { mutate } from "swr";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AnimatedTableWrapper,
  AnimatedTableBody,
  AnimatedTableRow,
} from "@/app/components/animated-components/animated-table";

// Datepicker
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import InputPlaceholderAnimate from "@/app/components/animated-components/animatedinput-placeholder";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

function InvoiceList() {
  const { invoices, deleteInvoice } = useContext(InvoiceContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Invoice");
  const [selectedProducts, setSelectedProducts] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  //date
  const [createdDateFilter, setCreatedDateFilter] = useState<
    Date | undefined
  >();
  const [dueDateFilter, setDueDateFilter] = useState<Date | undefined>();

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.billFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.billTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "All Invoice" || invoice.status === activeTab;

    const matchesCreatedDate = createdDateFilter
      ? new Date(invoice.createdDate).toDateString() ===
      createdDateFilter.toDateString()
      : true;

    const matchesDueDate = dueDateFilter
      ? new Date(invoice.dueDate).toDateString() ===
      dueDateFilter.toDateString()
      : true;

    return matchesSearch && matchesTab && matchesCreatedDate && matchesDueDate;
  });
  // pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  // Calculate the counts for different statuses
  const Paid = invoices.filter(
    (t: { status: string }) => t.status === "Paid",
  ).length;
  const Overdue = invoices.filter(
    (t: { status: string }) => t.status === "Overdue",
  ).length;
  const Pending = invoices.filter(
    (t: { status: string }) => t.status === "Pending",
  ).length;
  const Draft = invoices.filter(
    (t: { status: string }) => t.status === "Draft",
  ).length;

  // filter status wise
  const statusFilter = [
    {
      label: "All Invoice",
      count: invoices.length,
      bgcolor: "bg-primary/5",

      txtcolor: "text-primary",
    },
    {
      label: "Paid",
      count: Paid,
      bgcolor: "bg-chart-2/12",

      txtcolor: "text-chart-2",
    },
    {
      label: "Overdue",
      count: Overdue,
      bgcolor: "bg-destructive/12",

      txtcolor: "text-destructive",
    },
    {
      label: "Pending",
      count: Pending,
      bgcolor: "bg-chart-4/12",

      txtcolor: "text-chart-4",
    },
    {
      label: "Draft",
      count: Draft,
      bgcolor: "bg-chart-5/12",
      txtcolor: "text-chart-5",
    },
  ];

  // Handle opening delete confirmation dialog
  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  // Handle confirming deletion of selected products
  const handleConfirmDelete = async () => {
    for (const productId of selectedProducts) {
      await deleteInvoice(productId);
    }
    setSelectedProducts([]);
    setSelectAll(false);
    setOpenDeleteDialog(false);
  };

  // Handle closing delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Reset Invoice on browser refresh
  const location = usePathname();
  const handleResetTickets = async () => {
    const response = await fetch("/api/invoice", {
      method: "GET",
      headers: {
        broserRefreshed: "true",
      },
    });
    const result = await response.json();
    await mutate("/api/invoice");
  };

  useEffect(() => {
    const isPageRefreshed = sessionStorage.getItem("isPageRefreshed");
    if (isPageRefreshed === "true") {
      console.log("page refreshed");
      sessionStorage.removeItem("isPageRefreshed");
      handleResetTickets();
    }
  }, [location]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("isPageRefreshed", "true");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const safeFormatDate = (date: string | Date) => {
    if (!date) return "";
    if (typeof date === "string") {
      return format(new Date(date), "dd MMMM yyyy");
    }
    return format(date, "dd MMMM yyyy");
  };

  return (
    <div className="overflow-x-auto">
      {/* filter & add invoice */}
      <div className="flex lg:flex-row flex-col lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap lg:order-1 order-2">
          {statusFilter.map(({ label, count, bgcolor, txtcolor }) => (
            <div
              key={label}
              className={`flex px-2 py-1.5 rounded-md items-center gap-2 ${activeTab === label
                ? " bg-primary/5 "
                : "text-muted-foreground hover:bg-primary/5 "
                } hover:cursor-pointer`}
              onClick={() => setActiveTab(label)}
            >
              <p className="text-sm font-medium">{label}</p>
              <p
                className={cn(
                  "text-sm font-medium px-2.5 py-1 rounded-full",
                  bgcolor,
                  txtcolor,
                )}
              >
                {count}
              </p>
            </div>
          ))}
        </div>
        <div className="lg:order-2 order-1">
          <Button className="w-full">
            <Link href="/apps/invoice/create">New Invoice</Link>
          </Button>
        </div>
      </div >
      {/* search & filter */}
      < div className="flex sm:flex-row flex-col item-center gap-2 my-6" >
        <div className="relative">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2  text-muted-foreground"
          />

          <InputPlaceholderAnimate
            value={searchTerm}
            onChange={setSearchTerm}
            placeholders={[
              "Search bill...",
              "Find bill from...",
              "Look up bill to...",
            ]}
          />
        </div>
        {/* Created Date Picker */}
        <div>
          <Popover>
            <PopoverTrigger className={"w-full"}>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal border border-border hover:bg-transparent hover:border-primary ${!createdDateFilter
                  ? "text-muted-foreground hover:text-muted-foreground"
                  : "text-muted-foreground"
                  }`}
              >
                {createdDateFilter
                  ? format(createdDateFilter, "PPP")
                  : "Created Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={createdDateFilter}
                onSelect={setCreatedDateFilter}
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* Due Date Picker */}
        <div>
          <Popover>
            <PopoverTrigger className={"w-full"}>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal border border-border hover:bg-transparent hover:border-primary ${!dueDateFilter
                  ? "text-muted-foreground hover:text-muted-foreground"
                  : "text-muted-foreground "
                  }`}
              >
                {dueDateFilter ? format(dueDateFilter, "PPP") : "Due Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDateFilter}
                onSelect={setDueDateFilter}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <AnimatedTableWrapper className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-4">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={(checked) => {
                    const isChecked = Boolean(checked);
                    setSelectAll(isChecked);
                    if (isChecked) {
                      setSelectedProducts(
                        filteredInvoices.map((invoice) => invoice.id),
                      );
                    } else {
                      setSelectedProducts([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Id</TableHead>
              <TableHead>Bill From</TableHead>
              <TableHead>Bill To</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <AnimatedTableBody className="divide-y divide-border">
            {currentInvoices.map((invoice, index: number) => (
              <AnimatedTableRow key={invoice.id} index={index}>
                <TableCell className="p-4">
                  <Checkbox
                    checked={selectedProducts.includes(invoice.id)}
                    onCheckedChange={(checked) => {
                      const isChecked = Boolean(checked);
                      if (isChecked) {
                        setSelectedProducts((prev: any) => [
                          ...prev,
                          invoice.id,
                        ]);
                      } else {
                        setSelectedProducts((prev: any[]) =>
                          prev.filter((id: number) => id !== invoice.id),
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {invoice.id}
                </TableCell>
                <TableCell>{invoice.billFrom}</TableCell>
                <TableCell>{invoice.billTo}</TableCell>
                <TableCell>{invoice.totalCost}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      invoice.status === "Paid"
                        ? "bg-chart-2/12 text-chart-2"
                        : invoice.status === "Overdue"
                          ? "bg-destructive/12 text-destructive"
                          : invoice.status === "Draft"
                            ? "bg-chart-5/12 text-chart-5"
                            : invoice.status === "Pending"
                              ? "bg-chart-4/12 text-chart-4"
                              : "bg-primary/5 text-primary",
                    )}
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>{safeFormatDate(invoice.createdDate)}</TableCell>
                <TableCell>{safeFormatDate(invoice.dueDate)}</TableCell>
                <TableCell className="text-center">
                  <TooltipProvider>
                    <div className="flex justify-center gap-3">
                      <Tooltip>
                        <TooltipTrigger>
                          <Button className="h-8 w-8 p-0 mb-2 group rounded-full bg-chart-2/12 text-chart-2 hover:bg-chart-2 hover:text-white">
                            <Link
                              href={`/apps/invoice/edit/${invoice.billFrom}`}
                            >
                              <Icon icon="solar:pen-outline" height={18} />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Invoice</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button className="h-8 w-8 p-0 mb-2 group rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-black">
                            <Link
                              href={`/apps/invoice/detail/${invoice.billFrom}`}
                            >
                              <Icon icon="solar:eye-outline" height={18} />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Invoice</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            className="h-8 w-8 p-0 mb-2 group rounded-full  bg-destructive/12 text-destructive hover:bg-destructive hover:text-white"
                            onClick={() => {
                              setSelectedProducts([invoice.id]);
                              handleDelete();
                            }}
                          >
                            <Icon
                              icon="solar:trash-bin-minimalistic-outline"
                              height={18}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Invoice</TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </TableCell>
              </AnimatedTableRow>
            ))}
          </AnimatedTableBody>
        </Table>
      </AnimatedTableWrapper>

      {/* pagination control */}
      <div className="flex items-center justify-between flex-wrap mt-6 lg:gap-0 gap-2">
        {/* Rows per page selector */}
        <div className="flex items-center gap-1">
          <p className="text-sm text-muted-foreground">Show</p>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setCurrentPage(1);
              setItemsPerPage(Number(value));
            }}
          >
            <SelectTrigger className="w-fit me-0" aria-label="Rows per page">
              <SelectValue>
                {itemsPerPage ? itemsPerPage : "Rows per page"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20].map((item) => (
                <SelectItem key={item} value={String(item)}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">per page</p>
        </div>

        {/* Page info and navigation */}
        <div className="flex items-center gap-5">
          <p className="text-sm font-normal text-muted-foreground">
            {filteredInvoices.length === 0
              ? "0–0"
              : `${indexOfFirstItem + 1}-${Math.min(
                indexOfLastItem,
                filteredInvoices.length,
              )}`}{" "}
            of {filteredInvoices.length}
          </p>
          <div className="flex items-center gap-2">
            <Icon
              icon="solar:arrow-left-line-duotone"
              className={` hover:text-primary cursor-pointer ${currentPage === 1 ? "opacity-50 !cursor-not-allowed" : ""
                }`}
              width={20}
              height={20}
              onClick={() =>
                currentPage > 1 && setCurrentPage((prev) => prev - 1)
              }
            />
            <span className="w-8 h-8 bg-primary/5 text-primary flex items-center justify-center rounded-md  text-sm font-normal">
              {currentPage}
            </span>
            <Icon
              icon="solar:arrow-right-line-duotone"
              className={` hover:text-primary cursor-pointer ${currentPage === totalPages
                ? "opacity-50 !cursor-not-allowed"
                : ""
                }`}
              width={20}
              height={20}
              onClick={() =>
                currentPage < totalPages && setCurrentPage((prev) => prev + 1)
              }
            />
          </div>
        </div>
      </div>

      {/* delete modal */}
      <Dialog open={openDeleteDialog} onOpenChange={handleCloseDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg ">
              Are you sure you want to delete selected Invoice?
            </DialogTitle>
          </DialogHeader>

          <DialogFooter className="mx-auto bg-transparent dark:bg-transparent">
            <Button onClick={handleCloseDeleteDialog} >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
}

export default InvoiceList;
