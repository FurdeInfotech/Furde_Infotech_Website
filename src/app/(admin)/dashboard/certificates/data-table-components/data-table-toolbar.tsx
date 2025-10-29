"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const certificateTypes = [
  { label: "Internship", value: "Internship" },
  { label: "Appreciation", value: "Appreciation" },
  { label: "Game Changer", value: "Game Changer" },
  { label: "Excellence", value: "Excellence" },
  { label: "Achievement", value: "Achievement" },
];

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Filter by employee name..."
          value={(table.getColumn("employeeName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("employeeName")?.setFilterValue(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("certificateType") && (
          <DataTableFacetedFilter
            column={table.getColumn("certificateType")}
            title="Certificate Type"
            options={certificateTypes}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
