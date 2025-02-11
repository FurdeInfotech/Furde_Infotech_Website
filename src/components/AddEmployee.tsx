import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { employeesIDSchema } from "@/schemas/employeesidSchema";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface Props {
  refreshData: () => void;
}

function AddEmployee({ refreshData }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const bloodGroup = ["A+", "A-", "B-", "O+", "O-", "AB+", "AB-", "B+"];

  const form = useForm<z.infer<typeof employeesIDSchema>>({
    resolver: zodResolver(employeesIDSchema),
    defaultValues: {
      empid: "",
      empname: "",
      emprole: "",
      empmobile: "",
      empemergencymobile: "",
      empbloodgroup: undefined,
      empaddress: "",
      empimage: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof employeesIDSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("empid", data.empid);
      formData.append("empname", data.empname);
      formData.append("emprole", data.emprole);
      formData.append("empmobile", data.empmobile);
      formData.append("empemergencymobile", data.empemergencymobile);
      formData.append("empaddress", data.empaddress);
      formData.append("empbloodgroup", data.empbloodgroup);
      if (data.empimage) {
        formData.append("empimage", data.empimage);
      }

      const response = await axios.post("/api/add-employeesid", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Employee added successfully!",
        });
  
        // **Download QR Code instead of opening the link**
        const qrCodeUrl = response.data.qrCodeUrl; // Cloudinary URL
  
        // Fetch the image as a Blob
        const qrResponse = await fetch(qrCodeUrl);
        const blob = await qrResponse.blob();
        const blobUrl = URL.createObjectURL(blob);
  
        // Create a temporary <a> tag to trigger the download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${data.empname}_qrcode.png`; // Force download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        // Revoke the Blob URL to free up memory
        URL.revokeObjectURL(blobUrl);
  
        // Close the dialog
        setDialogOpen(false);
        form.reset(); // Reset the form fields
        refreshData(); // Refresh the data
      }
    } catch (error) {
      console.error("Failed to add Employee:", error);
      toast({
        title: "Error",
        description: `Failed to add Employee: ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <Button
        size="sm"
        className="bg-blue-500 hover:bg-blue-600 duration-200 "
        onClick={() => setDialogOpen(true)}
      >
       <Plus/> Add Employee
      </Button>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => !isSubmitting && setDialogOpen(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-3">
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="  h-4 w-4 animate-spin" />
                     Adding
                    </>
                  ) : (
                    "Add"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddEmployee;
