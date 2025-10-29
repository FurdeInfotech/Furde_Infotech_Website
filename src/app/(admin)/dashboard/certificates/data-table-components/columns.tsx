"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Certificate } from "./schema";

export const columns: ColumnDef<Certificate>[] = [
  {
    accessorKey: "employeeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("employeeName")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "certificateType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Certificate Type" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
            {row.getValue("certificateType")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => {
      const startDate = row.getValue("startDate") as string | undefined;
      return (
        <div className="flex w-[100px] items-center">
          <span>
            {startDate
              ? new Date(startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "-"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => {
      const endDate = row.getValue("endDate") as string | undefined;
      return (
        <div className="flex w-[100px] items-center">
          <span>
            {endDate
              ? new Date(endDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "-"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "dateAwarded",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Awarded" />
    ),
    cell: ({ row }) => {
      const dateAwarded = row.getValue("dateAwarded") as string;
      return (
        <div className="flex w-[100px] items-center">
          <span>
            {new Date(dateAwarded).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      );
    },
  },
];
