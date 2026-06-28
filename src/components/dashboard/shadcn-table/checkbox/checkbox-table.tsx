"use client";
import { EllipsisVertical } from 'lucide-react';
import { Icon } from "@iconify/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckboxTableData } from '../table-data'
import Image from "next/image";

const CheckboxTable = () => {
  const tableActionData = [
    { icon: "tabler:plus", listtitle: "Add" },
    { icon: "tabler:edit", listtitle: "Edit" },
    { icon: "tabler:trash", listtitle: "Delete" },
  ];

  return (
    <>
      <div className="border rounded-md border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base font-semibold py-3">
                  #
                </TableHead>
                <TableHead className="text-base font-semibold py-3">
                  Invoice
                </TableHead>
                <TableHead className="text-base font-semibold py-3">
                  Status
                </TableHead>
                <TableHead className="text-base font-semibold py-3">
                  Customer
                </TableHead>
                <TableHead className="text-base font-semibold py-3">
                  Progress
                </TableHead>
                <TableHead className="text-base font-semibold py-3"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-border ">
              {CheckboxTableData.map((item, index) => (
                <TableRow key={index}>
                  {/* Checkbox */}
                  <TableCell className="whitespace-nowrap">
                    <Checkbox />
                  </TableCell>

                  {/* Invoice */}
                  <TableCell className="whitespace-nowrap">
                    <h6 className="text-sm">{item.invoice}</h6>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="whitespace-nowrap">

                    <Badge className={`bg-${item.statuscolor} capitalize flex items-center gap-1 w-fit 
                    `}>


                      {item.statusicon && <item.statusicon size={15} />}

                      {item.status}
                    </Badge>
                  </TableCell>

                  {/* Customer */}
                  < TableCell className="whitespace-nowrap" >
                    <div className="flex gap-3 items-center">
                      <Image
                        src={item.avatar || ""}
                        alt="icon"
                        className="h-10 w-10 rounded-full"
                        width={40}
                        height={40}
                      />
                      <div className="truncate line-clamp-2 max-w-56">
                        <h6 className="text-base">{item.name}</h6>
                        <p className="text-sm text-muted-foreground">{item.handle}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Progress */}
                  <TableCell className="whitespace-nowrap">
                    <div className="text-muted-foreground text-sm flex items-center gap-3 w-full">
                      <Progress value={item.progress as number}
                        className="w-full
    [&_[data-slot=progress-track]]:bg-primary/12
    [&_[data-slot=progress-indicator]]:bg-primary
  "
                      />
                      {item.progress}%
                    </div>
                  </TableCell>

                  {/* Dropdown Menu */}
                  <TableCell className="whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <span className="btn-circle-hover">
                          <EllipsisVertical size={22} />
                        </span>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        {tableActionData.map((action, idx) => (
                          <DropdownMenuItem key={idx} className="flex gap-3">
                            <Icon icon={action.icon} height={18} />
                            <span>{action.listtitle}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div >
      </div >
    </>
  );
};

export default CheckboxTable;
