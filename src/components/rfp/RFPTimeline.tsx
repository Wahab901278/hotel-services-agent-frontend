"use client";

import { Check, Clock, FileSearch, FileCheck, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RFPStatus } from "@/lib/types";

const steps: { status: RFPStatus; label: string; icon: React.ElementType }[] = [
  { status: "received", label: "Received", icon: Send },
  { status: "processing", label: "Processing", icon: FileSearch },
  { status: "proposals_ready", label: "Proposals Ready", icon: FileCheck },
  { status: "accepted", label: "Accepted", icon: Check },
];

interface RFPTimelineProps {
  currentStatus: RFPStatus;
}

export function RFPTimeline({ currentStatus }: RFPTimelineProps) {
  const currentIdx = steps.findIndex((s) => s.status === currentStatus);
  const isRejected = currentStatus === "rejected";

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, i) => {
        const isCompleted = i < currentIdx;
        const isCurrent = i === currentIdx;
        const Icon = step.icon;

        return (
          <div key={step.status} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                  isRejected && isCurrent
                    ? "border-destructive bg-destructive text-destructive-foreground"
                    : isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCurrent
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : isCurrent && !isRejected ? (
                  <Clock className="h-5 w-5 animate-pulse" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium",
                  isCompleted || isCurrent
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 w-12 sm:w-20 md:w-28 transition-colors",
                  i < currentIdx ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
