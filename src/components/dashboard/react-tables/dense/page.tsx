"use client";
import React from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import Image from "next/image";
import TitleIconCard from "../../shared/titleicon-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface TableTypeDense {
  avatar?: string;
  name?: string;
  post?: string;
  pname?: string;
  teams: {
    id: string;
    color: string;
    text: string;
  }[];
  status?: string;
  statuscolor?: string;
  budget?: string;
}

const basicTableData: TableTypeDense[] = [
  {
    avatar: "/images/profile/user-1.jpg",
    name: "Sunil Joshi",
    post: "Web Designer",
    pname: "Elite Admin",
    status: "Active",
    statuscolor: "chart-2",
    teams: [
      {
        id: "1",
        color: "destructive",
        text: "S",
      },
      {
        id: "2",
        color: "secondary   ",
        text: "D",
      },
    ],
    budget: "$3.9",
  },
  {
    avatar: "/images/profile/user-2.jpg",
    name: "Andrew McDownland",
    post: "Project Manager",
    pname: "Real Homes WP Theme",
    status: "Pending",
    statuscolor: "chart-4",
    teams: [
      {
        id: "1",
        color: "secondary",
        text: "N",
      },
      {
        id: "2",
        color: "chart-4   ",
        text: "X",
      },
      {
        id: "3",
        color: "primary   ",
        text: "A",
      },
    ],
    budget: "$24.5k",
  },
  {
    avatar: "/images/profile/user-3.jpg",
    name: "Christopher Jamil",
    post: "Project Manager",
    pname: "MedicalPro WP Theme",
    status: "Completed",
    statuscolor: "primary",
    teams: [
      {
        id: "1",
        color: "secondary",
        text: "X",
      },
    ],
    budget: "$12.8k",
  },
  {
    avatar: "/images/profile/user-7.jpg",
    name: "Nirav Joshi",
    post: "Frontend Engineer",
    pname: "Hosting Press HTML",
    status: "Active",
    statuscolor: "chart-2",
    teams: [
      {
        id: "1",
        color: "primary",
        text: "X",
      },
      {
        id: "2",
        color: "destructive",
        text: "Y",
      },
    ],
    budget: "$2.4k",
  },
  {
    avatar: "/images/profile/user-5.jpg",
    name: "Micheal Doe",
    post: "Content Writer",
    pname: "Helping Hands WP Theme",
    status: "Cancel",
    statuscolor: "destructive",
    teams: [
      {
        id: "1",
        color: "secondary",
        text: "S",
      },
    ],
    budget: "$9.3k",
  },
];

const columnHelper = createColumnHelper<TableTypeDense>();

const columns = [
  columnHelper.accessor("avatar", {
    cell: (info) => (
      <div className="flex items-center space-x-2 p-1">
        <Image
          src={info.getValue() || ""}
          alt="User Avatar"
          height={42}
          width={42}
          className="h-10 w-10 rounded-full"
        />
        <div className="truncate max-w-32">
          <h6 className="text-sm font-medium">{info.row.original.name}</h6>
          <p className="text-xs text-muted-foreground">
            {info.row.original.post}
          </p>
        </div>
      </div>
    ),
    header: () => <span>User</span>,
  }),
  columnHelper.accessor("pname", {
    header: () => <span>Project Name</span>,
    cell: (info) => (
      <p className=" text-base text-muted-foreground">{info.getValue()}</p>
    ),
  }),
  columnHelper.accessor("teams", {
    header: () => <span>Team</span>,
    cell: (info) => (
      <div className="flex">
        {info.getValue().map((team) => (
          <div className="-ms-2" key={team.id}>
            <div
              className={`bg-${team.color} text-white border-2 border-white dark:border-border h-10 w-10 flex justify-center items-center text-xl font-medium  rounded-full`}
            >
              {team.text}
            </div>
          </div>
        ))}
      </div>
    ),
  }),
  columnHelper.accessor("status", {
    header: () => <span>Status</span>,
    cell: (info) => (
      <Badge
        className={`bg-${info.row.original.statuscolor}  capitalize`}
      >
        {info.getValue()}
      </Badge>
    ),
  }),
  columnHelper.accessor("budget", {
    header: () => <span>Budget</span>,
    cell: (info) => (
      <h6 className="text-base text-muted-foreground">{info.getValue()}</h6>
    ),
  }),
];

const ReactDenseTable = () => {
  const [data] = React.useState(basicTableData);
  const [density, setDensity] = React.useState("md");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDownload = () => {
    const headers = [
      "Name",
      "post",
      "pname",
      "status",
      "statuscolor",
      "teams",
      "budget",
    ];
    const rows = data.map((item) => [
      item.name,
      item.post,
      item.pname,
      item.status,
      item.statuscolor,
      item.teams.map((items) => items.text).join(", "),
      item.budget,
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

  const getPadding = (density: string) => {
    switch (density) {
      case "sm":
        return "p-1";
      case "md":
        return "p-2";
      case "lg":
        return "p-4";
      default:
        return "p-2";
    }
  };

  return (
    <TitleIconCard title="Dense Table" onDownload={handleDownload}>
      <div className="pb-6">
        <Button
          className={"text-white"}
          onClick={() =>
            setDensity((prev) =>
              prev === "lg" ? "sm" : prev === "sm" ? "md" : "lg",
            )
          }
        >
          Toggle Density
        </Button>
      </div>
      <div className="border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`text-base  font-semibold text-left border-b  border-border  transition-all duration-200 ${getPadding(
                        density,
                      )}`}
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
                    <td
                      key={cell.id}
                      className={`whitespace-nowrap transition-all duration-200 ${getPadding(
                        density,
                      )} text-sm`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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

export default ReactDenseTable;
