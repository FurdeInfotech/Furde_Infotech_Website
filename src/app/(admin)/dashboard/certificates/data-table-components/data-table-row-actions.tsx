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
import { Trash2, Pencil, Eye, Share2, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [isSharing, setIsSharing] = useState(false);
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

  const handleShareCertificate = async () => {
    if (!shareEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shareEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);

    try {
      const certificateUrl = `${window.location.origin}/certificates/${certificate._id}`;
      
      const response = await fetch("/api/share-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientEmail: shareEmail,
          recipientName: certificate.employeeName,
          certificateType: certificate.certificateType,
          dateAwarded: certificate.dateAwarded,
          certificateUrl,
          startDate: certificate.startDate,
          endDate: certificate.endDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to share certificate");
      }

      toast({
        title: "Success!",
        description: `Certificate has been sent to ${shareEmail}`,
      });

      setShareEmail("");
      setShareModalOpen(false);
    } catch (error) {
      console.error("Error sharing certificate:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to share certificate",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* View Certificate */}
        <Link href={`/certificates/${certificate._id}`} target="_blank">
          <Button variant="ghost" size="icon" title="View Certificate">
            <Eye className="h-4 w-4 text-blue-500" />
          </Button>
        </Link>

        {/* Share Certificate */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShareModalOpen(true)}
          title="Share Certificate"
        >
          <Share2 className="h-4 w-4 text-green-500" />
        </Button>

        {/* Edit Certificate */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(certificate)}
          title="Edit Certificate"
        >
          <Pencil className="h-4 w-4 text-amber-600" />
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

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Share Certificate via Email
            </DialogTitle>
            <DialogDescription>
              Enter the email address where you want to send this certificate.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSharing) {
                    handleShareCertificate();
                  }
                }}
                disabled={isSharing}
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Certificate for:</strong> {certificate.employeeName}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Type:</strong> {certificate.certificateType}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShareModalOpen(false);
                setShareEmail("");
              }}
              disabled={isSharing}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleShareCertificate}
              disabled={isSharing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSharing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
