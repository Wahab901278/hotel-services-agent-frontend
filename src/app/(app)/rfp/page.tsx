"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Plus, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { RFPForm } from "@/components/rfp/RFPForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRFPStore, useAuthStore } from "@/lib/store";
import { rfpApi } from "@/lib/api";
import { toast } from "sonner";
import type { RFPStatus } from "@/lib/types";

const statusColors: Record<RFPStatus, string> = {
  received: "bg-blue-100 text-blue-800",
  processing: "bg-yellow-100 text-yellow-800",
  proposals_ready: "bg-green-100 text-green-800",
  accepted: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

export default function RFPPage() {
  const { rfps, isLoading, setRFPs, addRFP, setLoading } = useRFPStore();
  const { user } = useAuthStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadRFPs() {
      if (!user) return;
      setLoading(true);
      try {
        const data = await rfpApi.getUserRFPs(user.id);
        setRFPs(data);
      } catch {
        toast.error("Failed to load RFPs");
      } finally {
        setLoading(false);
      }
    }
    loadRFPs();
  }, [user, setRFPs, setLoading]);

  const handleSubmit = async (
    data: Record<string, unknown>,
    requirements: string[]
  ) => {
    setIsSubmitting(true);
    try {
      const rfp = await rfpApi.create({
        company_name: data.company_name as string,
        contact_email: data.contact_email as string,
        event_type: data.event_type as string,
        guest_count: data.guest_count as number,
        check_in: data.check_in as string,
        check_out: data.check_out as string,
        budget_min: data.budget_min as number | undefined,
        budget_max: data.budget_max as number | undefined,
        requirements: Object.fromEntries(
          requirements.map((r) => [r, true])
        ),
      });
      addRFP(rfp);
      setDialogOpen(false);
      toast.success("RFP submitted successfully");
    } catch {
      toast.error("Failed to submit RFP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = async (file: File) => {
    setIsSubmitting(true);
    try {
      const rfp = await rfpApi.upload(file);
      addRFP(rfp);
      setDialogOpen(false);
      toast.success("RFP uploaded and processing");
    } catch {
      toast.error("Failed to upload RFP document");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Header title="RFP Management" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Actions bar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {rfps.length} RFP{rfps.length !== 1 ? "s" : ""}
            </p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New RFP
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
                <RFPForm
                  onSubmit={handleSubmit}
                  onUpload={handleUpload}
                  isLoading={isSubmitting}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Empty state */}
          {!isLoading && rfps.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h2 className="text-lg font-semibold mb-1">No RFPs Yet</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Submit a Request for Proposal to find the best hotel matches
                for your event. You can fill out a form or upload a document.
              </p>
            </div>
          )}

          {/* RFP list */}
          {rfps.map((rfp) => (
            <Link key={rfp.id} href={`/rfp/${rfp.id}`}>
              <Card className="transition-shadow hover:shadow-md cursor-pointer">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{rfp.company_name}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[rfp.status]}`}
                      >
                        {rfp.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {rfp.event_type} &mdash; {rfp.guest_count} guests
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {rfp.check_in} to {rfp.check_out}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    {rfp.budget_max && (
                      <p>
                        Budget: &euro;{rfp.budget_min || 0} &ndash; &euro;
                        {rfp.budget_max}
                      </p>
                    )}
                    <Badge variant="outline" className="mt-1">
                      RFP #{rfp.id.slice(0, 8)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
