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
import { Loader2 } from "lucide-react";
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

      await axios.post("/api/add-employeesid", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: "Success",
        description: "Photo added to the gallery successfully!",
      });

      // Close the dialog
      setDialogOpen(false);
      form.reset(); // Reset the form fields
      refreshData(); // Refresh the data
    } catch (error) {
      console.error("Failed to add photo:", error);
      toast({
        title: "Error",
        description: `Failed to add photo: ${error}`,
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
        className="bg-blue-500 hover:bg-blue-600 duration-200"
        onClick={() => setDialogOpen(true)}
      >
        Add Employee
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Employee ID */}

              <FormField
                control={form.control}
                name="empid"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
                    <FormLabel>Employee Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emprole"
                render={({ field }) => (
                  <FormItem>
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

              <FormField
                control={form.control}
                name="empmobile"
                render={({ field }) => (
                  <FormItem className=" md:col-span-1 col-span-2">
                    <FormLabel>Phone*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Mobile No."
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
                  <FormItem className=" md:col-span-1 col-span-2">
                    <FormLabel>Phone*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Emergency Mobile No."
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
                name="empbloodgroup"
                render={({ field }) => (
                  <FormItem>
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
                      <Loader2 className=" mr-2 h-4 w-4 animate-spin" />
                      Please wait
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
