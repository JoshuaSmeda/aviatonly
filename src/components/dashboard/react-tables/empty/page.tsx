"use client";
import React, { useState } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import Image from "next/image";
import TitleIconCard from "@/components/dashboard/shared/titleicon-card";
import { Label } from "@/components/ui/label";
import { TableType } from "../../shadcn-table/table-data";
import { Input } from "@/components/ui/input";

const columnHelper = createColumnHelper<TableType>();

const columns = [
  columnHelper.accessor("avatar", {
    header: () => <span>User</span>,
  }),
  columnHelper.accessor("pname", {
    header: () => <span>Project Name</span>,
  }),
  columnHelper.accessor("teams", {
    header: () => <span>Team</span>,
  }),
  columnHelper.accessor("status", {
    header: () => <span>Status</span>,
  }),
  columnHelper.accessor("budget", {
    header: () => <span>Budget</span>,
  }),
];

const EmptyTable = () => {
  const [data] = React.useState([]);
  const [search, setSearch] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearchChange = (columnId: string, value: string) => {
    setSearch((prev) => ({ ...prev, [columnId]: value }));
  };

  return (
    <>
      <TitleIconCard title="Empty Table">
        <div className="border rounded-md border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Input
              type="text"
              placeholder="search 0 records..."
              className="ml-4  py-2! !px-4! w-auto mt-4"
            />
            <table className="min-w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-base font-semibold text-left border-b border-border px-4 py-3  whitespace-nowrap"
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            <Label className="mb-1 block">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </Label>
                            <Input
                              type="text"
                              placeholder={`Search ${header.id}`}
                              className=" py-2! px-4! sm:w-full w-37.5"
                              onChange={(e) =>
                                handleSearchChange(header.id, e.target.value)
                              }
                            />
                          </>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-border ">
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-8 px-4"
                  >
                    <div className="flex flex-col items-center">
                      <Image
                        src="/images/svgs/no-data.webp"
                        alt="No data"
                        height={100}
                        width={100}
                        className="mb-4"
                      />
                    </div>
                  </td>
                </tr>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-base font-semibold  text-left px-4 py-3 "
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
              </tbody>
            </table>
          </div>
        </div>
      </TitleIconCard>
    </>
  );
};

export default EmptyTable;
