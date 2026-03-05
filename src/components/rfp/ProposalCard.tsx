"use client";

import { Star, MapPin, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RFPProposal } from "@/lib/types";

interface ProposalCardProps {
  proposal: RFPProposal;
  rank: number;
  onViewDetails?: (proposal: RFPProposal) => void;
}

export function ProposalCard({
  proposal,
  rank,
  onViewDetails,
}: ProposalCardProps) {
  const matchPercent = Math.round(proposal.match_score);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
              {rank}
            </div>
            <div>
              <h3 className="font-semibold">
                {proposal.hotel?.name || "Hotel"}
              </h3>
              {proposal.hotel && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {proposal.hotel.city}, {proposal.hotel.country}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Match score */}
          <div className="text-right">
            <div
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                matchPercent >= 90
                  ? "bg-green-100 text-green-800"
                  : matchPercent >= 70
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-orange-100 text-orange-800"
              }`}
            >
              {matchPercent}% match
            </div>
          </div>
        </div>

        {/* Hotel rating */}
        {proposal.hotel && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: proposal.hotel.star_rating }).map(
                (_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                  />
                )
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {proposal.hotel.avg_review}/5 ({proposal.hotel.total_reviews}{" "}
              reviews)
            </span>
          </div>
        )}

        {/* Proposal text excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {proposal.proposal_text}
        </p>

        {/* Pricing highlights */}
        {proposal.pricing && Object.keys(proposal.pricing).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(proposal.pricing)
              .slice(0, 3)
              .map(([key, value]) => (
                <Badge key={key} variant="outline" className="text-xs">
                  <Check className="mr-1 h-3 w-3" />
                  {key}: &euro;{String(value)}
                </Badge>
              ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails?.(proposal)}
          >
            View Full Proposal
          </Button>
          <Badge variant={proposal.status === "draft" ? "secondary" : "default"}>
            {proposal.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
