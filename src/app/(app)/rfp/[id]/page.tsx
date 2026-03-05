"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, FileText, Users, MapPin, CalendarCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { RFPTimeline } from "@/components/rfp/RFPTimeline";
import { ProposalCard } from "@/components/rfp/ProposalCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { rfpApi } from "@/lib/api";
import { toast } from "sonner";
import type { RFP, RFPProposal } from "@/lib/types";

export default function RFPDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rfpId = params.id as string;

  const [rfp, setRfp] = useState<RFP | null>(null);
  const [proposals, setProposals] = useState<RFPProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRFP() {
      try {
        const [rfpData, proposalData] = await Promise.all([
          rfpApi.getById(rfpId),
          rfpApi.getProposals(rfpId),
        ]);
        setRfp(rfpData);
        setProposals(proposalData);
      } catch {
        toast.error("Failed to load RFP details");
      } finally {
        setIsLoading(false);
      }
    }
    loadRFP();
  }, [rfpId]);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <Header title="RFP Details" />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!rfp) {
    return (
      <div className="flex h-full flex-col">
        <Header title="RFP Details" />
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-muted-foreground">RFP not found</p>
          <Button variant="link" onClick={() => router.push("/rfp")}>
            Back to RFPs
          </Button>
        </div>
      </div>
    );
  }

  const requirements = rfp.requirements
    ? Object.entries(rfp.requirements)
        .filter(([, v]) => v)
        .map(([k]) => k)
    : [];

  return (
    <div className="flex h-full flex-col">
      <Header title={`RFP - ${rfp.company_name}`} />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/rfp")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to RFPs
          </Button>

          {/* Timeline */}
          <Card>
            <CardContent className="p-6">
              <RFPTimeline currentStatus={rfp.status} />
            </CardContent>
          </Card>

          {/* RFP details */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <h2 className="text-lg font-semibold">RFP Details</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="font-medium">{rfp.company_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Event Type</p>
                  <p className="font-medium capitalize">{rfp.event_type}</p>
                </div>
                <div className="flex items-start gap-2 space-y-1">
                  <Users className="h-4 w-4 text-muted-foreground mt-4" />
                  <div>
                    <p className="text-xs text-muted-foreground">Guests</p>
                    <p className="font-medium">{rfp.guest_count}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 space-y-1">
                  <CalendarCheck className="h-4 w-4 text-muted-foreground mt-4" />
                  <div>
                    <p className="text-xs text-muted-foreground">Dates</p>
                    <p className="font-medium text-sm">
                      {rfp.check_in} to {rfp.check_out}
                    </p>
                  </div>
                </div>
              </div>

              {rfp.budget_max && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Budget Range (per night)
                    </p>
                    <p className="font-medium">
                      &euro;{rfp.budget_min || 0} &ndash; &euro;{rfp.budget_max}
                    </p>
                  </div>
                </>
              )}

              {requirements.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Requirements
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {requirements.map((req) => (
                        <span
                          key={req}
                          className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="text-xs text-muted-foreground">
                <p>Contact: {rfp.contact_email}</p>
                <p>
                  Submitted: {new Date(rfp.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Proposals */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Proposals ({proposals.length})
            </h2>

            {proposals.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <MapPin className="h-10 w-10 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {rfp.status === "processing"
                      ? "Proposals are being generated. Check back soon!"
                      : "No proposals yet."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              proposals
                .sort((a, b) => b.match_score - a.match_score)
                .map((proposal, i) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    rank={i + 1}
                  />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
