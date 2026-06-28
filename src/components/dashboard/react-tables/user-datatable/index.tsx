"use client";

import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  RowData,

} from "@tanstack/react-table";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { uniqueId } from "lodash";

import { toast, ToastContainer } from "react-toastify";
import { CustomizerContext } from "@/app/context/customizer-context";
import {
  AnimatedTableBody,
  AnimatedTableRow,
  AnimatedTableWrapper,
} from "../../animated-components/animated-table";


interface UserType {
  id: string;
  avatar?: string;
  userName: string;
  role: string;
  badgecolor?: string;
  age: number;
  phone: string;
  email: string;
  isNew?: boolean;
}

interface UserTableMeta {
  editedRowData: Record<string, Partial<UserType>>;
  setEditedRowData: React.Dispatch<React.SetStateAction<Record<string, Partial<UserType>>>>;
  editingRowId: string | null;
  setEditingRowId: React.Dispatch<React.SetStateAction<string | null>>;
  setUserData: React.Dispatch<React.SetStateAction<UserType[]>>;
  setFeedback: React.Dispatch<React.SetStateAction<string | null>>;
  handleDelete: (rowId: string) => void;
}

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    editedRowData?: any;
    setEditedRowData?: any;
    editingRowId?: any;
    setEditingRowId?: any;
    setUserData?: any;
    setFeedback?: any;
    handleDelete?: any;
    handleSaveAction?: any;
    handleCancel?: any;
  }
}





const User: UserType[] = [
  {
    id: uniqueId(),
    avatar: "/images/profile/user-1.jpg",
    userName: "James Johnson",
    role: "Admin",
    badgecolor: "bg-chart-5",
    age: 30,
    phone: "123-456-7890",
    email: "alice@company.com",
  },
  {
    id: uniqueId(),
    avatar: "/images/profile/user-2.jpg",
    userName: "Maria Hernandez",
    role: "User",
    badgecolor: "bg-chart-2",
    age: 45,
    phone: "555-312-8899",
    email: "bobsmith@gmail.com",
  },
  {
    id: uniqueId(),
    avatar: "/images/profile/user-3.jpg",
    userName: "Clara Mason",
    role: "Superadmin",
    badgecolor: "bg-chart-4",
    age: 38,
    phone: "402-123-4567",
    email: "clara@enterprise.com",
  },
  {
    id: uniqueId(),
    avatar: "/images/profile/user-4.jpg",
    userName: "Derek White",
    role: "Moderator",
    badgecolor: "bg-destructive",
    age: 29,
    phone: "212-321-6789",
    email: "derek@forum.com",
  },
  {
    id: uniqueId(),
    avatar: "/images/profile/user-5.jpg",
    userName: "Eva Carter",
    role: "Author",
    badgecolor: "bg-chart-5",
    age: 33,
    phone: "678-999-8212",
    email: "eva@blogging.com",
  },
  {
    id: uniqueId(),
    avatar: "/images/profile/user-6.jpg",
    userName: "Frank Zhou",
    role: "User",
    badgecolor: "bg-chart-2",
    age: 41,
    phone: "504-222-9990",
    email: "fzhou@yahoo.com",
  },
  {
    id: uniqueId(),
    avatar: "/images/profile/user-7.jpg",
    userName: "Grace Lee",
    role: "Admin",
    badgecolor: "bg-chart-5",
    age: 27,
    phone: "703-301-4444",
    email: "gracelee@company.com",
  },
  {
    id: uniqueId(),
    avatar: "/images/profile/user-8.jpg",
    userName: "Henry Ford",
    role: "Superadmin",
    badgecolor: "bg-chart-4",
    age: 52,
    phone: "888-456-1234",
    email: "henry.ford@auto.com",
  },
];

const roleColorMap: Record<string, string> = {
  Admin: "bg-chart-5/12 text-chart-5",
  User: "bg-chart-2/12 text-chart-2",
  Superadmin: "bg-chart-4/12 text-chart-4",
  Moderator: "bg-destructive/12 text-destructive",
  Author: "bg-primary/12 text-primary",
};

function UserDataTable() {
  const { activeMode } = useContext(CustomizerContext);
  const [userData, setUserData] = useState<UserType[]>(
    User.map((userdata) => ({ ...userdata })),
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [rowSelection, setRowSelection] = useState({});
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editedRowData, setEditedRowData] = useState<
    Record<string, Partial<UserType>>
  >({});
  const [showSearch, setShowSearch] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({
    id: true,
    userName: true,
    role: true,
    age: true,
    phone: true,
    email: true,
  });

  const [showNewUserRow, setShowNewUserRow] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserType>>({
    id: uniqueId(),
    avatar: "/images/profile/jason.png",
    userName: "",
    role: "user",
    age: 0,
    phone: "",
    email: "",
  });

  const handleDelete = (rowId: string) => {
    setUserData((prev) => prev.filter((item) => item.id !== rowId));
    setFeedback("User deleted");
  };

  // Create column helper
  const columnHelper = createColumnHelper<UserType>();

  // Build all columns using columnHelper
  const allColumns = useMemo(
    () =>
      [
        // ✅ Select Checkbox
        columnHelper.display({
          id: "select",
          header: ({ table }) => (
            <Checkbox
              className={"cursor-pointer"}
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(checked) =>
                table.toggleAllPageRowsSelected(checked === true)
              }
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              className={"cursor-pointer"}

              checked={!!row.getIsSelected()}
              onCheckedChange={(checked) =>
                row.toggleSelected(checked === true)
              }
            />
          ),
        }),

        // ✅ Name
        columnHelper.accessor("userName", {
          header: "Name",
          cell: ({ row, table }) => {
            const meta = table.options.meta as UserTableMeta;
            const rowId = row.original.id;
            const isEditing = meta.editingRowId === rowId;
            const editedRow = meta.editedRowData[rowId] || {};

            return isEditing ? (
              <Input
                value={editedRow.userName ?? row.original.userName}
                onChange={(e) =>
                  meta.setEditedRowData((prev) => ({
                    ...prev,
                    [rowId]: {
                      ...prev[rowId],
                      userName: e.target.value,
                      avatar: prev[rowId]?.avatar ?? row.original.avatar,
                    },
                  }))
                }
                aria-label="Edit user name"

              />
            ) : (
              <div className="flex items-center gap-2 flex-nowrap w-full">
                <Avatar>
                  <AvatarImage
                    src={row.original.avatar}
                    alt={row.original.userName}
                  />
                  <AvatarFallback>{row.original.userName}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium">{row.original.userName}</p>
              </div>
            );
          },
        }),

        // ✅ Role
        columnHelper.accessor("role", {
          header: "Role",
          cell: ({ row, table }) => {
            const meta = table.options.meta as UserTableMeta;
            const rowId = row.original.id;
            const isEditing = meta.editingRowId === rowId;
            const editedRow = meta.editedRowData[rowId] || {};

            return isEditing ? (
              <Select
                value={editedRow.role ?? row.original.role}
                onValueChange={(value) =>
                  meta.setEditedRowData((prev) => ({
                    ...prev,
                    [rowId]: {
                      ...prev[rowId],
                      role: value ?? "",
                    },
                  }))
                }
              >
                <SelectTrigger
                  className="select-md-transparent !pe-0 cursor-pointer"
                  aria-label="Edit Role"
                >
                  <SelectValue className={"cursor-pointer"}>
                    {editedRow.role ? editedRow.role : "Select Role"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {["Admin", "User", "Superadmin", "Moderator", "Author"].map(
                    (role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            ) : (
              <Badge
                variant="default"
                className={roleColorMap[row.original.role]}
              >
                {row.original.role}
              </Badge>
            );
          },
        }),

        // ✅ Age
        columnHelper.accessor("age", {
          header: "Age",
          cell: ({ row, table }) => {
            const meta = table.options.meta as UserTableMeta;
            const rowId = row.original.id;
            const isEditing = meta.editingRowId === rowId;
            const editedRow = meta.editedRowData[rowId] || {};

            return isEditing ? (
              <Input
                type="number"
                step="0.01"

                value={
                  editedRow.age !== undefined ? editedRow.age : row.original.age
                }
                onChange={(e) =>
                  meta.setEditedRowData((prev) => ({
                    ...prev,
                    [rowId]: {
                      ...prev[rowId],
                      age: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    },
                  }))
                }
                aria-label="Edit age"
              />
            ) : (
              <p className="text-sm font-medium">{row.original.age}</p>
            );
          },
        }),

        // ✅ Phone
        columnHelper.accessor("phone", {
          header: "Phone",
          cell: ({ row, table }) => {
            const meta = table.options.meta as UserTableMeta;
            const rowId = row.original.id;
            const isEditing = meta.editingRowId === rowId;
            const editedRow = meta.editedRowData[rowId] || {};

            return isEditing ? (
              <Input
                className="w-full !form-control"
                value={editedRow.phone ?? row.original.phone}
                onChange={(e) =>
                  meta.setEditedRowData((prev) => ({
                    ...prev,
                    [rowId]: {
                      ...prev[rowId],
                      phone: e.target.value,
                    },
                  }))
                }
                aria-label="Edit phone"
              />
            ) : (
              <p className="text-sm font-medium">{row.original.phone}</p>
            );
          },
        }),

        // ✅ Email
        columnHelper.accessor("email", {
          header: "Email",
          cell: ({ row, table }) => {
            const meta = table.options.meta as UserTableMeta;
            const rowId = row.original.id;
            const isEditing = meta.editingRowId === rowId;
            const editedRow = meta.editedRowData[rowId] || {};

            return isEditing ? (
              <Input
                className="w-full !form-control"
                value={editedRow.email ?? ""}
                onChange={(e) =>
                  meta.setEditedRowData((prev) => ({
                    ...prev,
                    [rowId]: {
                      ...prev[rowId],
                      email: e.target.value,
                    },
                  }))
                }
                aria-label="Edit email"
              />
            ) : (
              <p className="text-sm font-medium">{row.original.email}</p>
            );
          },
        }),

        // ✅ Actions
        columnHelper.display({
          id: "actions",
          header: "Actions",
          cell: ({ row, table }) => {
            const meta = table.options.meta as UserTableMeta;
            const rowId = row.original.id;
            const isEditing = meta.editingRowId === rowId;

            return (
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant={"ghost"}
                      className={
                        "hover:bg-chart-2/12 hover:text-chart-2 text-chart-2"
                      }
                      size={"icon"}
                      onClick={() => {
                        meta.setUserData((prev) =>
                          prev.map((item) =>
                            item.id === row.original.id
                              ? { ...item, ...meta.editedRowData[rowId] }
                              : item,
                          ),
                        );
                        meta.setEditingRowId(null);
                        meta.setFeedback("User updated");
                      }}
                      aria-label="Save changes"
                    >
                      <Icon
                        icon="solar:check-read-linear"
                        width={20}
                        height={20}
                        className="text-success"
                      />
                    </Button>
                    <Button
                      variant={"ghost"}
                      className={
                        "hover:bg-destructive hover:text-destructive text-destructive"
                      }
                      size={"icon"}
                      type="button"
                      onClick={() => meta.setEditingRowId(null)}
                      aria-label="Cancel edit"
                    >
                      <Icon
                        icon="solar:close-circle-linear"
                        width={20}
                        height={20}
                      />
                    </Button>
                  </>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        size={"sm"}
                        variant={"ghost"}
                        className={"hover:bg-primary/5 hover:text-primary"}
                      >
                        <Icon
                          icon="solar:menu-dots-bold"
                          width={18}
                          height={18}
                          aria-label="menu"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          meta.setEditingRowId(rowId);
                          meta.setEditedRowData((prev) => ({
                            ...prev,
                            [rowId]: { ...row.original },
                          }));
                        }}
                        className="cursor-pointer"
                      >
                        <Icon
                          icon="solar:pen-2-linear"
                          width={20}
                          height={20}
                          className="me-2"
                        />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => meta.handleDelete(rowId)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Icon
                          icon="solar:trash-bin-2-outline"
                          width={20}
                          height={20}
                          className="me-2"
                        />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            );
          },
        }),
      ] as ColumnDef<UserType>[],
    [],
  );

  // Filter columns based on columnVisibility before passing to useReactTable
  const visibleColumns = useMemo(
    () =>
      allColumns.filter((col) => {
        if (col.id === "select") return true;
        if ("accessorKey" in col && typeof col.accessorKey === "string") {
          return columnVisibility[col.accessorKey];
        }
        if (col.id === "actions") return true;
        return true;
      }),
    [allColumns, columnVisibility],
  );

  // Filter orderData based on columnFilters
  const filteredData = useMemo(() => {
    return roleFilter === "All"
      ? userData
      : userData.filter((user) => user.role === roleFilter);
  }, [roleFilter, userData]);

  const table = useReactTable({
    data: filteredData,
    columns: visibleColumns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: true,
    meta: {
      editedRowData,
      setEditedRowData,
      editingRowId,
      setEditingRowId,
      setUserData,
      setFeedback,
      handleDelete,
    },
  });

  // Memoize visible column keys for export
  const visibleExportKeys = useMemo(
    () =>
      visibleColumns
        .filter(
          (col) =>
            "accessorKey" in col && col.id !== "select" && col.id !== "actions",
        )
        .map((col) => (col as { accessorKey: keyof UserType }).accessorKey),
    [visibleColumns],
  );

  // Memoize export headers
  const exportHeaders = useMemo(
    () =>
      visibleColumns
        .filter(
          (col) =>
            "accessorKey" in col && col.id !== "select" && col.id !== "actions",
        )
        .map((col) => (typeof col.header === "string" ? col.header : col.id)),
    [visibleColumns],
  );

  // Optimized CSV export handler
  const handleExportCSV = useCallback(() => {
    const rows = filteredData.map((row) =>
      visibleExportKeys.map((key) => row[key] ?? ""),
    );
    const csvContent = [
      exportHeaders.join(","),
      ...rows.map((r) =>
        r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredData, visibleExportKeys, exportHeaders]);

  // Optimized bulk delete handler
  const handleBulkDelete = useCallback(() => {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((r) => r.original.id);
    setUserData((prev) =>
      prev.filter((item) => !selectedIds.includes(item.id)),
    );
    table.resetRowSelection();
    setFeedback(`Deleted ${selectedIds.length} user(s)`);
  }, [table]);

  useEffect(() => {
    if (!feedback) return;

    const timer = setTimeout(() => {
      setFeedback(null);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // Cleanup on unmount or feedback change
  }, [feedback]);

  // react toastify setup.
  const toastColor = activeMode === "dark" ? "dark" : "light";
  useEffect(() => {
    if (feedback) {
      toast(feedback, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: toastColor,
      });
    }
  }, [feedback]);

  return (
    <Card className="p-6">
      <div>
        {/* title */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
          <h3 className="text-lg font-semibold  mb-4 md:mb-0">User Table</h3>
          <div className="flex flex-wrap items-center gap-1">
            {/* Search */}
            {!showSearch ? (
              <Button
                variant={"ghost"}
                onClick={() => setShowSearch(true)}
                aria-label="Show search"
                className="px-3 hover:bg-primary/5 hover:text-primary text-primary"
              >
                <Icon
                  icon={"solar:minimalistic-magnifer-line-duotone"}
                  width={18}
                  height={18}
                />
              </Button>
            ) : (
              <Input
                placeholder="Search..."
                className="!form-control w-40 md:w-56"
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                onBlur={() => {
                  if (!globalFilter) setShowSearch(false);
                }}
                aria-label="Search orders"
              />
            )}

            {/* Column visibility dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant={"ghost"}
                  className="px-3 hover:bg-primary/5 hover:text-primary text-primary"
                >
                  <Icon
                    icon="solar:settings-line-duotone"
                    width={18}
                    height={18}
                    aria-label="Settings"
                  />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48 p-2 ">
                {Object.keys(columnVisibility).map((col) => (
                  <DropdownMenuItem
                    key={col}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      checked={columnVisibility[col]}
                      onCheckedChange={() =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          [col]: !prev[col],
                        }))
                      }
                    />
                    <span className="capitalize">{col}</span>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuCheckboxItem
                  checked
                  disabled
                  className="capitalize"
                >
                  actions
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Download as CSV button */}
            <Button
              variant={"ghost"}
              className="px-3 hover:bg-primary/5 hover:text-primary text-primary"
              onClick={handleExportCSV}
              aria-label="Download CSV"
            >
              <Icon
                icon="solar:download-minimalistic-line-duotone"
                width={18}
                height={18}
              />
            </Button>

            {/* Bulk delete button */}
            {table.getSelectedRowModel().rows.length > 0 && (
              <Button variant={"destructive"} onClick={handleBulkDelete}>
                <Icon icon="solar:trash-bin-2-outline" width={18} height={18} />
              </Button>
            )}
          </div>
        </div>

        {/* filter & create user */}
        <div className="flex md:flex-row flex-col gap-2 item-center justify-between my-5">
          <div>
            <div className="rounded-md border border-border flex-wrap">
              {[
                "All",
                "Admin",
                "User",
                "Superadmin",
                "Moderator",
                "Author",
              ].map((role) => {
                const isSelected = roleFilter === role;
                return (
                  <Button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`  ${isSelected
                      ? "bg-primary/20 text-primary  hover:bg-primary/5 hover:text-primary"
                      : "bg-transparent  hover:bg-primary/5  text-foreground"
                      } focus:ring-0 first:!border-s-0`}
                  >
                    {role}
                  </Button>
                );
              })}
            </div>
          </div>
          <Button
            onClick={() => setShowNewUserRow(true)}
            className="w-fit "
          >
            Create User
          </Button>
        </div>

        {/* Feedback Toast */}
        {feedback && <ToastContainer />}

        {/* user table */}
        <div className="overflow-x-auto">
          <div className="border rounded-md border-border overflow-hidden">
            <AnimatedTableWrapper className="overflow-x-auto">
              <table className="min-w-full w-full">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-2 border-b border-border text-left"
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              className={
                                header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : ""
                              }
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <div className="flex items-center gap-1">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                                {header.column.getCanSort() && (
                                  <Icon icon="solar:transfer-vertical-line-duotone" />
                                )}
                              </div>
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <AnimatedTableBody>
                  {/* Add New Row */}
                  {showNewUserRow && (
                    <tr className="border-b last:border-b-0  border-border ">
                      <td className="px-4 py-2">
                        <Checkbox aria-label="Select row" className={"cursor-pointer"} />
                      </td>
                      <td className="px-4 py-2 min-w-[180px]">
                        <Input
                          value={newUser.userName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewUser((prev) => ({
                              ...prev,
                              userName: e.target.value,
                            }))
                          }
                          aria-label="Edit user name"

                        />
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={newUser.role}
                          onValueChange={(value) =>
                            setNewUser((prev) => ({
                              ...prev,
                              role: value ?? "",
                            }))
                          }
                        >
                          <SelectTrigger
                            className="select-md-transparent"
                            aria-label="Select Role"
                          >
                            <SelectValue>
                              {newUser.role ? newUser.role : "Select Role"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Admin",
                              "User",
                              "Superadmin",
                              "Moderator",
                              "Author",
                            ].map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2 min-w-[180px]">
                        <Input
                          type="number"
                          value={newUser.age}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewUser((prev) => ({
                              ...prev,
                              age: Number(e.target.value),
                            }))
                          }

                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          value={newUser.phone}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewUser((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="Phone"

                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          value={newUser.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewUser((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="Email"

                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => {
                              const id = uniqueId();
                              setUserData((prev) => [
                                ...prev,
                                { ...newUser, id } as UserType,
                              ]);
                              setNewUser({
                                userName: "",
                                role: "User",
                                age: 0,
                                phone: "",
                                email: "",
                                avatar: "/images/profile/jason.png",
                              });
                              setShowNewUserRow(false);
                            }}
                            // variant={"lightsuccess"}
                            disabled={!newUser.userName || !newUser.email}
                          >
                            <Icon
                              icon={"solar:check-read-linear"}
                              width={24}
                              height={24}
                            />
                          </Button>
                          <Button
                            onClick={() => {
                              setShowNewUserRow(false);
                              setNewUser({
                                userName: "",
                                role: "User",
                                age: 0,
                                phone: "",
                                email: "",
                                avatar: "/images/profile/jason.png",
                              });
                            }}
                            variant={"destructive"}
                          >
                            <Icon
                              icon={"solar:close-circle-linear"}
                              width={24}
                              height={24}
                            />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={visibleColumns.length}
                        className="text-center py-4"
                      >
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row, index) => (
                      <React.Fragment key={row.id}>
                        <AnimatedTableRow
                          index={index}
                          className="border-b last:border-b-0 border-border"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className={`px-4 py-2 ${cell.column.id === "userName" ||
                                cell.column.id === "phone"
                                ? "min-w-[180px]"
                                : ""
                                }`}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </td>
                          ))}
                        </AnimatedTableRow>
                      </React.Fragment>
                    ))
                  )}
                </AnimatedTableBody>
              </table>
            </AnimatedTableWrapper>
          </div>
        </div>
        {/* Pagination Controls */}
        {table.getPageCount() > 0 ? (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground ">Show</p>
              <Select
                value={String(table.getState().pagination.pageSize)}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger
                  className="w-fit"
                  aria-label="Select number of rows per page"
                >
                  <SelectValue>
                    {table.getState().pagination.pageSize
                      ? table.getState().pagination.pageSize
                      : "Rows per page"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {[3, 10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={String(pageSize)}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm  text-muted-foreground ">per page</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Page Summary */}
              <div>
                <p className="text-sm font-normal  text-muted-foreground">
                  {table.getRowModel().rows.length > 0
                    ? `${table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    1
                    }-${Math.min(
                      (table.getState().pagination.pageIndex + 1) *
                      table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length,
                    )} of ${table.getFilteredRowModel().rows.length}`
                    : `0 of 0`}
                </p>
              </div>

              {/* Custom Pagination Controls */}
              <div className="flex items-center gap-2">
                <Icon
                  icon="solar:arrow-left-line-duotone"
                  className={`  hover:text-primary cursor-pointer ${table.getState().pagination.pageIndex === 0
                    ? "opacity-50 !cursor-not-allowed"
                    : ""
                    }`}
                  width={20}
                  height={20}
                  onClick={() => table.previousPage()}
                />
                <span className="w-8 h-8 bg-primary/12 text-primary flex items-center justify-center rounded-md   text-sm font-normal">
                  {table.getState().pagination.pageIndex + 1}
                </span>
                <Icon
                  icon="solar:arrow-right-line-duotone"
                  className={`  hover:text-primary cursor-pointer ${table.getState().pagination.pageIndex + 1 ===
                    table.getPageCount()
                    ? "opacity-50 !cursor-not-allowed"
                    : ""
                    }`}
                  width={20}
                  height={20}
                  onClick={() =>
                    table.getState().pagination.pageIndex + 1 <
                    table.getPageCount() && table.nextPage()
                  }
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export default UserDataTable;
