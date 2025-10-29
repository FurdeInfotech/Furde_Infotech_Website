"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, CalendarIcon, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { certificateSchema } from "@/schemas/certificateSchema";
import axios from "axios";
import { DataTable } from "./data-table-components/data-table";
import { columns } from "./data-table-components/columns";
import { DataTableRowActions } from "./data-table-components/data-table-row-actions";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type Certificate = {
  _id: string;
  employeeName: string;
  certificateType: string;
  startDate?: string;
  endDate?: string;
  dateAwarded: string;
  createdAt: string;
};

type Employee = {
  _id: string;
  empname: string;
};

function Page() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCertificateType, setSelectedCertificateType] = useState<string>("");
  const [employeeSearchOpen, setEmployeeSearchOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [dateAwarded, setDateAwarded] = useState<Date>();
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");

  const { toast } = useToast();

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) =>
    employee.empname.toLowerCase().includes(employeeSearchTerm.toLowerCase())
  );

  const form = useForm<z.infer<typeof certificateSchema>>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      employeeName: "",
      certificateType: undefined,
      startDate: "",
      endDate: "",
      dateAwarded: "",
    },
  });

  // Fetch certificates
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-certificates", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch certificates");
      }

      const data = await response.json();
      setCertificates(data.certificates);
    } catch (error) {
      console.error(error);
      toast({
        title: "Try Refreshing",
        description: `Failed to load Certificates: ${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/get-employeesid", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      setEmployees(data.employees);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete certificate is handled by DataTableRowActions component

  // Handle edit button click
  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setIsEditMode(true);
    setSelectedCertificateType(certificate.certificateType);
    
    // Set form values
    form.setValue("employeeName", certificate.employeeName);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.setValue("certificateType", certificate.certificateType as any);
    form.setValue("dateAwarded", certificate.dateAwarded);
    
    // Set dates
    setDateAwarded(new Date(certificate.dateAwarded));
    
    if (certificate.certificateType === "Internship" && certificate.startDate && certificate.endDate) {
      form.setValue("startDate", certificate.startDate);
      form.setValue("endDate", certificate.endDate);
      setStartDate(new Date(certificate.startDate));
      setEndDate(new Date(certificate.endDate));
    }
    
    setDialogOpen(true);
  };

  // Add or Update certificate
  const onSubmit = async (data: z.infer<typeof certificateSchema>) => {
    setIsSubmitting(true);
    try {
      // Convert dates to ISO strings
      const submitData = {
        ...data,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
        dateAwarded: dateAwarded ? dateAwarded.toISOString() : "",
      };

      if (isEditMode && editingCertificate) {
        // Update existing certificate
        await axios.put(`/api/update-certificate/${editingCertificate._id}`, submitData, {
          headers: { "Content-Type": "application/json" },
        });

        toast({
          title: "Success",
          description: "Certificate updated successfully!",
        });
      } else {
        // Add new certificate
        await axios.post("/api/add-certificate", submitData, {
          headers: { "Content-Type": "application/json" },
        });

        toast({
          title: "Success",
          description: "Certificate added successfully!",
        });
      }

      form.reset();
      setDialogOpen(false);
      setSelectedCertificateType("");
      setStartDate(undefined);
      setEndDate(undefined);
      setDateAwarded(undefined);
      setEmployeeSearchOpen(false);
      setIsEditMode(false);
      setEditingCertificate(null);
    } catch (error) {
      console.error("Failed to add certificate:", error);
      toast({
        title: "Error",
        description: `Failed to add certificate: ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      fetchCertificates();
    }
  };

  useEffect(() => {
    fetchCertificates();
    fetchEmployees();
  }, []);

  // Close employee dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.employee-search-container')) {
        setEmployeeSearchOpen(false);
      }
    };

    if (employeeSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [employeeSearchOpen]);

  return (
    <div className="h-full flex-1 flex-col  space-y-5 p-8 md:flex">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Certificates</h2>
          <p className="text-muted-foreground">
            Manage employee certificates here
          </p>
        </div>
        <Button
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 duration-200"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Certificate
        </Button>
      </div>

      <DataTable
        data={certificates}
        columns={[
          ...columns,
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
              <DataTableRowActions
                row={row}
                refreshData={fetchCertificates}
                onEdit={handleEdit}
              />
            ),
          },
        ]}
        loading={loading}
      />

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!isSubmitting) {
            setDialogOpen(open);
            if (!open) {
              form.reset();
              setSelectedCertificateType("");
              setEmployeeSearchTerm("");
              setIsEditMode(false);
              setEditingCertificate(null);
            }
          }
        }}
        modal={true}
      >
        <DialogContent 
          className="max-w-md"
          onInteractOutside={(e) => {
            // Prevent dialog from closing when clicking on calendar popover
            const target = e.target as HTMLElement;
            if (target.closest('[role="dialog"]') || target.closest('.rdp') || target.closest('[data-radix-popper-content-wrapper]')) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Certificate" : "Add Certificate"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Employee Name Select with Search */}
              <FormField
                control={form.control}
                name="employeeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Name*</FormLabel>
                    <div className="relative employee-search-container">
                      <Input
                        placeholder="Search employee..."
                        value={employeeSearchTerm}
                        onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                        onFocus={() => setEmployeeSearchOpen(true)}
                        className="mb-2"
                      />
                      {employeeSearchOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                          {filteredEmployees.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-gray-500">No employee found</div>
                          ) : (
                            filteredEmployees.map((employee) => (
                              <div
                                key={employee._id}
                                className={cn(
                                  "px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm flex items-center gap-2",
                                  field.value === employee.empname && "bg-blue-50"
                                )}
                                onClick={() => {
                                  field.onChange(employee.empname);
                                  setEmployeeSearchTerm(employee.empname);
                                  setEmployeeSearchOpen(false);
                                }}
                              >
                                {field.value === employee.empname && (
                                  <Check className="h-4 w-4 text-blue-600" />
                                )}
                                {employee.empname}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    {/* {field.value && (
                      <div className="text-sm text-gray-600 mt-1">
                        Selected: <span className="font-medium">{field.value}</span>
                      </div>
                    )} */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Certificate Type */}
              <FormField
                control={form.control}
                name="certificateType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate Type*</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedCertificateType(value);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Certificate Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Appreciation">Appreciation</SelectItem>
                        <SelectItem value="Game Changer">Game Changer</SelectItem>
                        <SelectItem value="Excellence">Excellence</SelectItem>
                        <SelectItem value="Achievement">Achievement</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditional Date Fields for Internship */}
              {selectedCertificateType === "Internship" && (
                <>
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date*</FormLabel>
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                type="button"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !startDate && "text-muted-foreground"
                                )}
                              >
                                {startDate ? (
                                  format(startDate, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start" style={{ zIndex: 9999 }}>
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={(date) => {
                                setStartDate(date);
                                field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date*</FormLabel>
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                type="button"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !endDate && "text-muted-foreground"
                                )}
                              >
                                {endDate ? (
                                  format(endDate, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start" style={{ zIndex: 9999 }}>
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={(date) => {
                                setEndDate(date);
                                field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                              }}
                              disabled={(date) =>
                                startDate ? date < startDate : false
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Date Awarded */}
              <FormField
                control={form.control}
                name="dateAwarded"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date Awarded*</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            type="button"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !dateAwarded && "text-muted-foreground"
                            )}
                          >
                            {dateAwarded ? (
                              format(dateAwarded, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start" style={{ zIndex: 9999 }}>
                        <Calendar
                          mode="single"
                          selected={dateAwarded}
                          onSelect={(date) => {
                            setDateAwarded(date);
                            field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-3">
                <DialogClose asChild className="sm:mt-0 mt-3 sm:w-auto w-full">
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    disabled={isSubmitting}
                  >
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
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : isEditMode ? (
                    "Update Certificate"
                  ) : (
                    "Add Certificate"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Page;
