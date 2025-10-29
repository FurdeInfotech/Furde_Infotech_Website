"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Pencil, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Link from "next/link";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  refreshData: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit: (certificate: any) => void;
}

export function DataTableRowActions<TData>({
  row,
  refreshData,
  onEdit,
}: DataTableRowActionsProps<TData>) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const certificate = row.original as any;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/delete-certificate/${certificate._id}`);
      toast({
        title: "Success",
        description: "Certificate deleted successfully.",
      });
      refreshData();
    } catch (error) {
      console.error("Failed to delete certificate:", error);
      toast({
        title: "Error",
        description: `Failed to delete certificate: ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* View Certificate */}
      <Link href={`/certificates/${certificate._id}`} target="_blank">
        <Button variant="ghost" size="icon" title="View Certificate">
          <Eye className="h-4 w-4 text-blue-500" />
        </Button>
      </Link>

      {/* Edit Certificate */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(certificate)}
        title="Edit Certificate"
      >
        <Pencil className="h-4 w-4 text-green-600" />
      </Button>

      {/* Delete Certificate */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isDeleting} title="Delete Certificate">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this certificate? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border border-neutral-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
