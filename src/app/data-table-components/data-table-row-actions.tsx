"use client";

import { useState } from "react";
import axios from "axios";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Download, Eye, Loader2, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { updateEmployeeSchema } from "@/schemas/employeesidSchema";

interface Employee {
  empid: string;
  empname: string;
  emprole: string;
  empbloodgroup: string;
  empmobile: number;
  empemergencymobile: number;
  empaddress: string;
  empimage: string;
  empqrcode: string;
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
  const bloodGroup = ["A+", "A-", "B-", "O+", "O-", "AB+", "AB-", "B+"];

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
  const form = useForm<z.infer<typeof updateEmployeeSchema>>({
    resolver: zodResolver(updateEmployeeSchema),
    defaultValues: {
      empid: employee?.empid || "",
      empname: employee?.empname || "",
      emprole: employee?.emprole || "",
      empmobile: employee?.empmobile?.toString() || "",
      empemergencymobile: employee?.empemergencymobile?.toString() || "",
      empbloodgroup:
        (employee?.empbloodgroup as
          | "A+"
          | "A-"
          | "B-"
          | "O+"
          | "O-"
          | "AB+"
          | "AB-"
          | "B+") || undefined,
      empaddress: employee?.empaddress || "",
      empimage: undefined, // File inputs do not support default values
    },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof updateEmployeeSchema>) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append all fields except image
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "empimage" && value) {
          formData.append(key, value as string);
        }
      });

      // Append image only if a new file is selected
      if (data.empimage instanceof File) {
        formData.append("empimage", data.empimage);
      }

      await axios.put(`/api/update-employeesid/${employee.empid}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({ title: "Success", description: "Employee updated successfully" });
      setDialogType(null);
      refreshData(); // Refresh data after update
    } catch (error) {
      toast({
        title: "Error Updating Employee",
        description: `Error: ${error} `,
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
        className="text-red-500 hover:text-red-500"
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
            <DialogTitle> {employee.empname}&apos;s Detail </DialogTitle>
          </DialogHeader>
          <div className="w-full space-y-8 mt-5">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <Image
                  src={employee.empimage}
                  alt={employee.empname}
                  width={200}
                  height={200}
                  priority
                  placeholder="blur"
                  blurDataURL={employee.empimage}
                />
              </div>
              <div className="flex flex-col">
                <Image
                  src={employee.empqrcode || "/fitmain.png"}
                  alt="Employee QR Code"
                  width={200}
                  height={200}
                  priority
                  placeholder="blur"
                  blurDataURL={employee.empqrcode || "/fitmain.png"}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <p className="text-sm">Employee ID</p>
                <p className="text-lg font-semibold">{employee.empid}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm">Name</p>
                <p className="text-lg font-semibold">{employee.empname}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex flex-col">
                <p className="text-sm ">Mobile</p>
                <p className="text-lg font-semibold">{employee.empmobile}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm ">Emergency Mobile</p>
                <p className="text-lg font-semibold">
                  {employee.empemergencymobile}
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <p className="text-sm ">Role</p>
                <p className="text-lg font-semibold">{employee.emprole}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm ">Blood Group</p>
                <p className="text-lg font-semibold">
                  {employee.empbloodgroup}
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <p className="text-sm ">Address</p>
                <p className="text-lg font-semibold">{employee.empaddress}</p>
              </div>
            </div>
          </div>
          <DialogFooter className=" pt-3">
            <DialogClose asChild className=" sm:w-auto w-full">
              <Button size="sm" variant="outline" className=" mr-0">
                {" "}
                Close
              </Button>
            </DialogClose>
            <Button
              type="button"
              size="sm"
              className="bg-blue-500 duration-200 hover:bg-blue-600"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  const response = await fetch(employee.empqrcode);
                  const blob = await response.blob();
                  const url = URL.createObjectURL(blob);

                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${employee.empname}_qrcode.png`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);

                  URL.revokeObjectURL(url);
                  toast({
                    title: "Success",
                    description: "QR code downloaded successfully",
                    variant: "default",
                  });
                } catch (error) {
                  console.error("Error downloading QR code:", error);
                  toast({
                    title: "Error",
                    description: "Failed to download QR code",
                    variant: "destructive",
                  });
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download />
                  Download QR Code
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={dialogType === "edit"}
        onOpenChange={() => setDialogType(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update {employee.empname}&apos;s Detail</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-3"
            >
              {/* Employee ID */}
              <div className=" flex gap-5 w-full items-center flex-row">
                <FormField
                  control={form.control}
                  name="empid"
                  render={({ field }) => (
                    <FormItem className=" w-full">
                      <FormLabel>Employee ID*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name */}

                <FormField
                  control={form.control}
                  name="empname"
                  render={({ field }) => (
                    <FormItem className=" w-full">
                      <FormLabel>Employee Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" flex gap-5 w-full items-center flex-row">
                <FormField
                  control={form.control}
                  name="emprole"
                  render={({ field }) => (
                    <FormItem className=" w-full">
                      <FormLabel>Employee Role*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Role" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="empbloodgroup"
                  render={({ field }) => (
                    <FormItem className=" w-full">
                      <FormLabel>Blood Group*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Blood Group" />
                        </SelectTrigger>

                        <SelectContent>
                          {bloodGroup.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className=" flex gap-5 w-full items-center flex-row">
                <FormField
                  control={form.control}
                  name="empmobile"
                  render={({ field }) => (
                    <FormItem className=" w-full">
                      <FormLabel>Mobile No.*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Mobile"
                          {...field}
                          maxLength={10}
                          type="text" // Keep type="text" for maxLength support
                          onInput={(e) => {
                            const input = e.target as HTMLInputElement;
                            input.value = input.value.replace(/\D/g, ""); // Remove non-numeric characters
                            if (input.value.length > 10) {
                              input.value = input.value.slice(0, 10); // Enforce 10 digits max
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="empemergencymobile"
                  render={({ field }) => (
                    <FormItem className=" w-full">
                      <FormLabel>Emergency Mobile No.*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Emergency Mobile"
                          {...field}
                          maxLength={10}
                          type="text" // Keep type="text" for maxLength support
                          onInput={(e) => {
                            const input = e.target as HTMLInputElement;
                            input.value = input.value.replace(/\D/g, ""); // Remove non-numeric characters
                            if (input.value.length > 10) {
                              input.value = input.value.slice(0, 10); // Enforce 10 digits max
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="empaddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Address*</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        className="resize-none"
                        placeholder="Enter Address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="empimage"
                render={({ field }) => (
                  <FormItem className=" cursor-pointer">
                    <FormLabel>Image*</FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]; // Get the selected file
                        field.onChange(file); // Update the field with the selected file
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className=" pt-3">
                <DialogClose asChild className="sm:mt-0 mt-3 sm:w-auto w-full">
                  <Button size="sm" variant="outline" className=" mr-2">
                    {" "}
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-500 duration-200 hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className=" h-4 w-4 animate-spin" />
                      Updating
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
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
                    title: "Error Deleting Employee",
                    description: `Error: ${error}`,
                    variant: "destructive",
                  });
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading} // Disable delete button while processing
            >
              {loading ? (
                <>
                  {" "}
                  <Loader2 className="h-4 w-4 animate-spin" /> Deleting{" "}
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
