"use client";

import { useState } from "react";
import axios from "axios";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, Loader2, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  empid: string;
  empname: string;
  email: string;
  department: string;
  designation: string;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  refreshData: () => void;
}

export function DataTableRowActions<TData>({
  row,
  refreshData,
}: DataTableRowActionsProps<TData>) {
  const [dialogType, setDialogType] = useState<"view" | "edit" | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employee, setEmployee] = useState<Employee>(row.original as Employee);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch employee details for view
  const fetchEmployeeDetails = async () => {
    try {
      const { data } = await axios.get(`/api/employees/${employee.empid}`);
      setEmployee(data);
    } catch (error) {
      console.error("Error fetching employee details", error);
    }
  };

  // Handle Edit Submission
  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/update-employeesid/${employee.empid}`, {
        empname: employee.empname,
      });
      toast({ title: "Success", description: "Employee updated successfully" });
      setDialogType(null);
      refreshData(); // Refresh the data
    } catch (error) {
      toast({
        title: "Error",
        description: "Error updating employee",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="flex gap-3">
      {/* View Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          fetchEmployeeDetails();
          setDialogType("view");
        }}
      >
        <Eye size={18} />
      </Button>

      {/* Edit Button */}
      <Button variant="ghost" size="icon" onClick={() => setDialogType("edit")}>
        <Pencil size={18} />
      </Button>

      {/* Delete Button */}
      <Button
        variant="ghost"
        size="icon"
        className="text-red-500 hover:bg-red-100"
        onClick={() => setShowDeleteConfirm(true)}
      >
        <Trash2 size={18} />
      </Button>

      {/* View Dialog */}
      <Dialog
        open={dialogType === "view"}
        onOpenChange={() => setDialogType(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          <p>
            <strong>Name:</strong> {employee.empname}
          </p>
          <p>
            <strong>Email:</strong> {employee.email}
          </p>
          <p>
            <strong>Department:</strong> {employee.department}
          </p>
          <p>
            <strong>Designation:</strong> {employee.designation}
          </p>
          <Button variant="outline" onClick={() => setDialogType(null)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={dialogType === "edit"}
        onOpenChange={() => setDialogType(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Name"
              value={employee.empname}
              onChange={(e) =>
                setEmployee({ ...employee, empname: e.target.value })
              }
            />
            <Button onClick={handleEditSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <p>
            Do you really want to delete {employee.empname}? This action cannot
            be undone.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                if (!loading) setShowDeleteConfirm(false);
              }}
              disabled={loading} // Disable cancel while deleting
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white"
              onClick={async () => {
                setLoading(true);
                try {
                  await axios.delete(
                    `/api/delete-employeesid/${employee.empid}`
                  );
                  toast({
                    title: "Success",
                    description: "Employee deleted successfully",
                  });
                  setShowDeleteConfirm(false); // ✅ Close only on success
                  refreshData(); // Refresh table data
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Error deleting employee",
                    variant: "destructive",
                  });
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading} // Disable delete button while processing
            >
              {loading ? <> <Loader2 className="h-4 w-4 animate-spin" /> Deleting </> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
