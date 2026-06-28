"use client";
import React, { useState } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import { Icon } from "@iconify/react";

import { Badge } from "@/components/ui/badge";
import TitleIconCard from "../../shared/titleicon-card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface EditableTableType {
  id: string;
  username: string;
  projectname: string;
  status: string;
  statuscolor: string;
  edit?: boolean;
}

const basicTableData2: EditableTableType[] = [
  {
    id: "1",
    username: "Olivia Rhye",
    projectname: "Xtreme admin",
    status: "active",
    statuscolor: "primary",
  },
  {
    id: "2",
    username: "Barbara Steele",
    projectname: "Adminpro admin",
    status: "cancel",
    statuscolor: "destructive",
  },
  {
    id: "3",
    username: "Leonard Gordon",
    projectname: "Monster admin",
    status: "active",
    statuscolor: "primary",
  },
  {
    id: "4",
    username: "Evelyn Pope",
    projectname: "matdashpro admin",
    status: "pending",
    statuscolor: "chart-4",
  },
  {
    id: "5",
    username: "Tommy Garza",
    projectname: "Elegant admin",
    status: "cancel",
    statuscolor: "destructive",
  },
  {
    id: "6",
    username: "Isabel Vasquez",
    projectname: "TailwindAdmin admin",
    status: "pending",
    statuscolor: "chart-4",
  },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "cancel", label: "Cancel" },
  { value: "pending", label: "Pending" },
];

const columnHelper = createColumnHelper<EditableTableType>();

const columns = [
  columnHelper.accessor("username", {
    header: () => <span>Username</span>,
    cell: (info) => <p className="text-base">{info.getValue()}</p>,
  }),
  columnHelper.accessor("projectname", {
    header: () => <span>Project Name</span>,
    cell: (info) => (
      <p className="text-base text-muted-foreground">{info.getValue()}</p>
    ),
  }),
  columnHelper.accessor("status", {
    header: () => <span>Status</span>,
    cell: (info) => {
      const row = info.row.original;
      return (
        <Badge className={`bg-${row.statuscolor} capitalize`}>
          {info.getValue()}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("edit", {
    id: "edit",
    header: () => <span>Edit</span>,
    cell: ({ row }) => (
      <Button
        onClick={() => row.getToggleExpandedHandler()}
        className="btn-circle-hover"
      >
        <Icon icon="tabler:edit" height={20} />
      </Button>
    ),
  }),
];

const Editable = () => {
  const [data, setData] = useState<EditableTableType[]>(basicTableData2);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<EditableTableType | null | any>(
    null,
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleEdit = (row: EditableTableType) => {
    setEditRowId(row.id);
    setEditedData({ ...row });
  };

  const handleSave = () => {
    if (editedData) {
      setData(
        data.map((item) => (item.id === editedData.id ? editedData : item)),
      );
      setEditRowId(null);
      setEditedData(null);
    }
  };

  const handleChange = (value: string, field: keyof EditableTableType) => {
    setEditedData((prev: any) => ({
      ...prev,
      [field]: value,
      statuscolor:
        value === "active"
          ? "primary"
          : value === "cancel"
            ? "destructive"
            : "chart-4",
    }));
  };

  const handleDownload = () => {
    const headers = ["Username", "Project Name", "Status"];
    const rows = data.map((item) => [
      item.username,
      item.projectname,
      item.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "table-data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <TitleIconCard title="Editable Table" onDownload={handleDownload}>
      <div className="border rounded-md border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-base  font-semibold text-left border-b border-border px-4 py-3"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border ">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap py-3 px-4">
                      {cell.column.id === "edit" ? (
                        editRowId === row.original.id ? (
                          <>
                            <button
                              onClick={handleSave}
                              className="text-primary mr-2 btn-circle-hover"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => setEditRowId(null)}
                              className="text-destructive btn-circle-hover hover:text-destructive"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEdit(row.original)}
                            className="btn-circle-hover text-primary"
                          >
                            <Icon icon="tabler:edit" height={20} />
                          </button>
                        )
                      ) : editRowId === row.original.id ? (
                        cell.column.id === "status" ? (
                          <div>
                            <Select
                              value={editedData?.status || ""}
                              onValueChange={(e) => handleChange(e, "status")}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue>
                                  {editedData?.status
                                    ? editedData?.status
                                    : "Select Status"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Status</SelectLabel>

                                  {statusOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <Input
                            type="text"
                            value={editedData?.[cell.column.id] || ""}
                            onChange={(e) =>
                              handleChange(
                                e.target.value,
                                cell.column.id as keyof EditableTableType,
                              )
                            }
                            className=" py-2! !px-4!"
                          />
                        )
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </TitleIconCard>
  );
};

export default Editable;
