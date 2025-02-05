"use client";

import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Expense } from "./schema";

export const columns: ColumnDef<Expense>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
 
  {
    accessorKey: "empimage",
    header: "Profile",
    cell: ({ row }) => {
      const imageUrl = row.original.empimage;

      return (
        <div className="flex items-center space-x-2">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={row.original.empname}
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/150";
              }}
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "empid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] capitalize">{row.getValue("empid")}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "empname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("empname")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "empmobile",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mobile No." />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize"> {row.getValue("empmobile")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "empemergencymobile",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Emergency No." />
    ),
    cell: ({ row }) => {
      const type = row.getValue("empemergencymobile");
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">
            {" "}
            {row.getValue("empemergencymobile")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "empbloodgroup",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Blood Group" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type");
      return (
        <div className="flex w-[50px] items-center">
          <span className={cn("capitalize")}>
            {" "}
            {row.getValue("empbloodgroup")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
