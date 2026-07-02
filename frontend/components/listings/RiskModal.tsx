"use client";

import { AlertTriangle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/common/Button";

interface Props {
  open: boolean;
  riskLevel: string;
  riskExplanation: string;
  onClose: () => void;
  onProceed?: () => void;
  onReport?: () => void;
}

// Backed by shadcn Dialog for focus trap and Escape key handling — this modal
// is the hard gate for high_risk checkouts (backend guide §05), so accessibility
// on the block is non-negotiable.
export default function RiskModal({
  open,
  riskLevel,
  riskExplanation,
  onClose,
  onProceed,
  onReport,
}: Props) {
  const safeRiskLevel = riskLevel || "high_risk";
  const safeExplanation =
    riskExplanation || "This listing has been flagged for review.";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-lg border-alert-red/30 sm:max-w-lg"
      >
        <div className="mb-2 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-alert-red/10">
            <AlertTriangle
              className="h-9 w-9 text-alert-red"
              aria-hidden="true"
            />
          </div>
        </div>

        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-2xl font-bold text-alert-red">
            High Risk Listing
          </DialogTitle>
          <DialogDescription className="text-sm">
            Risk Level:
            <span className="ml-1 font-semibold capitalize text-teal-deep">
              {safeRiskLevel.replace("_", " ")}
            </span>
          </DialogDescription>
        </DialogHeader>

        <p className="text-center text-sm text-gray-700">{safeExplanation}</p>

        <DialogFooter className="justify-center sm:justify-end">
          {onReport && (
            <Button onClick={onReport} variant="danger">
              Report
            </Button>
          )}

          <Button onClick={onClose} variant="neutral">
            Go Back
          </Button>

          {onProceed && (
            <Button onClick={onProceed} variant="cta">
              Proceed Anyway
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
