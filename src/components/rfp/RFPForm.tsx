"use client";

import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Upload, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const rfpSchema = z.object({
  company_name: z.string().min(2, "Company name is required"),
  contact_email: z.email("Invalid email address"),
  event_type: z.string().min(1, "Event type is required"),
  guest_count: z.number().min(1, "At least 1 guest required"),
  check_in: z.string().min(1, "Check-in date is required"),
  check_out: z.string().min(1, "Check-out date is required"),
  budget_min: z.number().optional(),
  budget_max: z.number().optional(),
  city: z.string().min(1, "City is required"),
  additional_notes: z.string().optional(),
});

type RFPFormData = z.infer<typeof rfpSchema>;

interface RFPFormProps {
  onSubmit: (data: RFPFormData, requirements: string[]) => Promise<void>;
  onUpload?: (file: File) => Promise<void>;
  isLoading?: boolean;
}

const eventTypes = [
  "Conference",
  "Wedding",
  "Corporate Retreat",
  "Workshop",
  "Gala",
  "Team Building",
  "Product Launch",
  "Training",
  "Other",
];

const requirementOptions = [
  "Conference Room",
  "Audio/Visual Equipment",
  "Catering",
  "Team Building Activities",
  "Breakout Rooms",
  "WiFi / High-Speed Internet",
  "Parking",
  "Airport Shuttle",
  "Accessibility Features",
  "Spa & Wellness",
];

export function RFPForm({ onSubmit, onUpload, isLoading }: RFPFormProps) {
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>(
    []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RFPFormData>({
    resolver: zodResolver(rfpSchema),
    defaultValues: { guest_count: 10 },
  });

  const toggleRequirement = (req: string) => {
    setSelectedRequirements((prev) =>
      prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      await onUpload(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h3 className="font-semibold">Submit RFP</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Describe your event and we&apos;ll find the best hotel matches.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="form">
          <TabsList className="w-full">
            <TabsTrigger value="form" className="flex-1">
              Fill Form
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex-1">
              Upload Document
            </TabsTrigger>
          </TabsList>

          {/* Manual form */}
          <TabsContent value="form">
            <form
              onSubmit={handleSubmit((data) =>
                onSubmit(data, selectedRequirements)
              )}
              className="space-y-4 mt-4"
            >
              {/* Company info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    {...register("company_name")}
                    placeholder="TechCorp Inc."
                  />
                  {errors.company_name && (
                    <p className="text-xs text-destructive">
                      {errors.company_name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    {...register("contact_email")}
                    placeholder="events@techcorp.com"
                  />
                  {errors.contact_email && (
                    <p className="text-xs text-destructive">
                      {errors.contact_email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Event details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Event Type</Label>
                  <Select
                    onValueChange={(val) => setValue("event_type", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.event_type && (
                    <p className="text-xs text-destructive">
                      {errors.event_type.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="guest_count">Guest Count</Label>
                  <Input
                    id="guest_count"
                    type="number"
                    min={1}
                    {...register("guest_count", { valueAsNumber: true })}
                  />
                  {errors.guest_count && (
                    <p className="text-xs text-destructive">
                      {errors.guest_count.message}
                    </p>
                  )}
                </div>
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <Label htmlFor="city">City / Location</Label>
                <Input
                  id="city"
                  {...register("city")}
                  placeholder="Prague, Czech Republic"
                />
                {errors.city && (
                  <p className="text-xs text-destructive">
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="rfp_check_in">Start Date</Label>
                  <Input
                    id="rfp_check_in"
                    type="date"
                    {...register("check_in")}
                  />
                  {errors.check_in && (
                    <p className="text-xs text-destructive">
                      {errors.check_in.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rfp_check_out">End Date</Label>
                  <Input
                    id="rfp_check_out"
                    type="date"
                    {...register("check_out")}
                  />
                  {errors.check_out && (
                    <p className="text-xs text-destructive">
                      {errors.check_out.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Budget */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="budget_min">Budget Min (per night)</Label>
                  <Input
                    id="budget_min"
                    type="number"
                    min={0}
                    placeholder="Optional"
                    {...register("budget_min", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="budget_max">Budget Max (per night)</Label>
                  <Input
                    id="budget_max"
                    type="number"
                    min={0}
                    placeholder="Optional"
                    {...register("budget_max", { valueAsNumber: true })}
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <Label>Requirements</Label>
                <div className="grid grid-cols-2 gap-2">
                  {requirementOptions.map((req) => (
                    <label
                      key={req}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedRequirements.includes(req)}
                        onCheckedChange={() => toggleRequirement(req)}
                      />
                      {req}
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional notes */}
              <div className="space-y-1.5">
                <Label htmlFor="additional_notes">
                  Additional Notes (optional)
                </Label>
                <Textarea
                  id="additional_notes"
                  {...register("additional_notes")}
                  placeholder="Any other requirements or preferences..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit RFP
              </Button>
            </form>
          </TabsContent>

          {/* Document upload */}
          <TabsContent value="upload">
            <div className="mt-4 space-y-4">
              <div
                className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 cursor-pointer hover:border-muted-foreground/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">
                  Click to upload your RFP document
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF or DOCX up to 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Our AI will automatically extract event details, dates, budget,
                and requirements from your document.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
