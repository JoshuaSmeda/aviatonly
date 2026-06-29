"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { HandCoins, Search } from "lucide-react";
import {
  DataTableColumnHeader,
} from "@/components/dashboard/shared/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOfferStatusMeta, OFFER_STATUS_META, OfferStatus } from "@/lib/aviatonly/domain";
import { formatTimeAgo, formatZar } from "@/lib/aviatonly/mock";
import type { OfferTableRow } from "@/lib/aviatonly/mock/types";

interface OffersDataTableProps {
  rows: OfferTableRow[];
  showListingColumns?: boolean;
  showSeller?: boolean;
  showActions?: boolean;
}

const OffersDataTable = ({
  rows,
  showListingColumns = true,
  showSeller = false,
  showActions = true,
}: OffersDataTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<OfferTableRow>[]>(() => {
    const cols: ColumnDef<OfferTableRow>[] = [];

    if (showActions) {
      cols.push({
        id: "actions",
        header: () => <span className="sr-only">Open</span>,
        cell: ({ row }) => (
          <Button size="sm" variant="outline" render={<Link href={row.original.listingHref} />}>
            Open
          </Button>
        ),
      });
    }

    if (showListingColumns) {
      cols.push({
        id: "aircraft",
        accessorFn: (row) => `${row.registration} ${row.aircraftTitle}`,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Aircraft" />,
        cell: ({ row }) => (
          <div className="min-w-32">
            <p className="font-medium">{row.original.registration}</p>
            <p className="truncate text-xs text-muted-foreground">{row.original.aircraftTitle}</p>
          </div>
        ),
      });
    }

    if (showSeller) {
      cols.push({
        accessorKey: "sellerName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Seller" />,
      });
    }

    cols.push(
      {
        accessorKey: "buyerName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Buyer" />,
      },
      {
        accessorKey: "amount",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
        sortingFn: (a, b) => a.original.amount - b.original.amount,
        cell: ({ row }) => (
          <span className="font-semibold tabular-nums">{formatZar(row.original.amount)}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        filterFn: (row, _id, value) => !value || row.original.status === value,
        cell: ({ row }) => {
          const meta = getOfferStatusMeta(row.original.status);
          return <Badge variant={meta.badgeVariant}>{meta.label}</Badge>;
        },
      },
      {
        accessorKey: "message",
        header: "Terms",
        cell: ({ row }) => (
          <span
            className="block min-w-0 truncate text-muted-foreground"
            title={row.original.message ?? undefined}
          >
            {row.original.message ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "expiresAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Expires" />,
        sortingFn: (a, b) => {
          const aTime = a.original.expiresAt ? new Date(a.original.expiresAt).getTime() : 0;
          const bTime = b.original.expiresAt ? new Date(b.original.expiresAt).getTime() : 0;
          return aTime - bTime;
        },
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {row.original.expiresAt
              ? new Date(row.original.expiresAt).toLocaleDateString("en-ZA")
              : "—"}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Received" />,
        sortingFn: (a, b) =>
          new Date(a.original.createdAt).getTime() - new Date(b.original.createdAt).getTime(),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {formatTimeAgo(row.original.createdAt)}
          </span>
        ),
      },
    );

    return cols;
  }, [showActions, showListingColumns, showSeller]);

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue).toLowerCase();
      if (!query) return true;
      const { buyerName, message, registration, aircraftTitle } = row.original;
      return [buyerName, message, registration, aircraftTitle]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query));
    },
  });

  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "all";

  return (
      <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <InputGroup className="sm:max-w-xs">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search buyer or terms…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </InputGroup>

        <Select
          value={statusFilter}
          onValueChange={(value) =>
            table.getColumn("status")?.setFilterValue(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All statuses</SelectItem>
              {Object.values(OfferStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {OFFER_STATUS_META[status].label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {table.getRowModel().rows.length === 0 ? (
        <Empty className="border py-10">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HandCoins />
            </EmptyMedia>
            <EmptyTitle>No offers found</EmptyTitle>
            <EmptyDescription>Try adjusting your search or filters.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="min-w-0 rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.id === "message" ? "max-w-56 whitespace-normal" : undefined}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {table.getFilteredRowModel().rows.length} of {rows.length} offer
        {rows.length === 1 ? "" : "s"}
      </p>
    </div>
  );
};

export default OffersDataTable;
