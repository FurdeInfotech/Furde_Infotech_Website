"use client";

import { DataTable } from "@/app/data-table-components/data-table";
import { columns } from "@/app/data-table-components/columns";
import { useEffect, useState } from "react";
import { DataTableRowActions } from "@/app/data-table-components/data-table-row-actions";
import { useToast } from "@/hooks/use-toast";
import AddEmployee from "@/components/AddEmployee";

type EmployeeID = {
  _id: number;
  empid: string;
  empname: string;
  emprole: string;
  empmobile: number;
  empemergencymobile: number;
  empbloodgroup: "A+" | "A-" | "B-" | "O+" | "O-" | "AB+" | "AB-" | "B+";
  empimage: string;
  empaddress: string;
};

export default function Page() {
  const [employeeIdItems, setEmployeeIdItems] = useState<EmployeeID[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEmployeeIdItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-employeesid", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        toast({
          title: "Try Refreshing",
          description: `Failed to load Employees`,
          variant: "destructive",
        });
        throw new Error("Failed to fetch employee id items");
      }

      const data = await response.json();
      setEmployeeIdItems(data.employees);
      console.log(data.employees);
    } catch (error) {
      console.error(error);
      toast({
        title: "Try Refreshing",
        description: `Failed to load Employees ${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeIdItems();
  }, []);

  return (
    <div className="h-full flex-1 flex-col space-y-5 p-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Here&apos;s a list of your employees!
        </p>
        <AddEmployee refreshData={fetchEmployeeIdItems} />
      </div>
      {/* Pass refreshData separately */}
      <DataTable
        data={employeeIdItems}
        columns={[
          ...columns,
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
              <DataTableRowActions
                row={row}
                refreshData={fetchEmployeeIdItems}
                
              />
            ),
          },
        ]}
        loading={loading}
      />
    </div>
  );
}
