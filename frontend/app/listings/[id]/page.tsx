"use client";

import { use, useState } from "react";
import { AlertTriangle, ChevronDown, Package, ShieldCheck } from "lucide-react";

import Loading from "@/components/common/Loading";
import RiskBadge from "@/components/listings/RiskBadge";
import BuyButton from "@/components/checkout/BuyButton";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useListing from "@/hooks/useListing";
import { formatCurrency } from "@/lib/utils";
import { Listing, RiskLevel } from "@/types/listing";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ListingDetailsPage({ params }: Props) {
  const { id } = use(params);
  const { listing, loading, error } = useListing(id);

  if (loading) return <Loading />;

  if (error || !listing) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="text-3xl font-bold text-teal-deep">Listing Not Found</h1>
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-6 md:p-8">
      <div className="grid gap-8 md:grid-cols-2">
        <ProductImage listing={listing} />

        <div className="flex flex-col">
          <TitleWithBadge listing={listing} />

          {listing.riskLevel === "caution" && (
            <CautionCollapse explanation={listing.riskExplanation} />
          )}

          {(listing.riskLevel === "suspicious" ||
            listing.riskLevel === "high_risk") && (
            <RiskBanner listing={listing} />
          )}

          <p className="mt-4 text-3xl font-bold text-teal-deep">
            {formatCurrency(listing.price)}
          </p>

          <p className="mt-4 text-sm text-gray-700">{listing.description}</p>

          <Separator className="my-6" />

          <div className="text-xs uppercase tracking-wide text-gray-500">Seller</div>
          <div className="mt-1 flex items-center gap-3">
            {listing.seller?.avatarUrl ? (
              <img
                src={listing.seller.avatarUrl}
                alt={listing.seller.displayName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm text-white">
                {listing.seller?.displayName
                  ? listing.seller.displayName.charAt(0).toUpperCase()
                  : "U"}
              </div>
            )}

            <div className="font-medium text-teal-deep">
              {listing.seller?.displayName
                ? listing.seller.displayName
                : listing.sellerId
                ? listing.sellerId.slice(0, 8) + "…"
                : "Unknown"}
            </div>
          </div>

          <div className="mt-6 grid max-w-sm gap-3">
            <BuyButton listing={listing} />
            <AddToCartButton listing={listing} />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <AiAnalysisCard listing={listing} />
      </div>
    </main>
  );
}

// -----------------------------------------------------------------------------

function ProductImage({ listing }: { listing: Listing }) {
  return (
    <div className="overflow-hidden rounded-xl bg-gray-100 ring-1 ring-black/5">
      {listing.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={listing.image}
          alt={listing.title}
          className="aspect-square w-full object-cover"
        />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center">
          <Package className="h-20 w-20 text-gray-400" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

function TitleWithBadge({ listing }: { listing: Listing }) {
  // clear + caution: badge inline with title. Suspicious + high_risk get a
  // full banner below, so the inline badge would be redundant for them.
  const showInline =
    listing.riskLevel === "clear" || listing.riskLevel === "caution";

  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <h1 className="text-3xl font-bold text-teal-deep">{listing.title}</h1>
      {showInline && <RiskBadge level={listing.riskLevel} />}
    </div>
  );
}

function CautionCollapse({ explanation }: { explanation: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-xs font-medium text-yellow-800 hover:underline"
      >
        Why is this cautioned?
        <ChevronDown
          className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="mt-2 rounded-lg border border-caution-yellow/40 bg-caution-yellow/10 p-3 text-sm text-gray-800">
          {explanation}
        </div>
      )}
    </div>
  );
}

function RiskBanner({ listing }: { listing: Listing }) {
  // Suspicious: orange, always visible, non-dismissable.
  // high_risk: red, always visible, non-dismissable — the modal is the actual gate.
  const isHigh = listing.riskLevel === "high_risk";
  const cls = isHigh
    ? "border-alert-red/40 bg-alert-red/10 text-alert-red"
    : "border-signal-orange/40 bg-signal-orange/10 text-signal-orange";

  return (
    <div
      className={`mt-4 flex items-start gap-3 rounded-lg border p-4 ${cls}`}
      role="alert"
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div>
        <div className="mb-1">
          <RiskBadge level={listing.riskLevel} />
        </div>
        <p className="text-sm">{listing.riskExplanation}</p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------

const RISK_BAR_COLORS: Record<RiskLevel, string> = {
  clear: "bg-green-500",
  caution: "bg-caution-yellow",
  suspicious: "bg-signal-orange",
  high_risk: "bg-alert-red",
};

function AiAnalysisCard({ listing }: { listing: Listing }) {
  const score = Math.max(0, Math.min(100, listing.riskScore));
  const barColor = RISK_BAR_COLORS[listing.riskLevel];

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-teal-mid" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-teal-deep">
          AI Fraud Analysis
        </h2>
      </div>

      <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
        <span>Risk Score</span>
        <span className="font-mono font-semibold text-teal-deep">
          {score}/100
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="mt-4 text-sm text-gray-700">{listing.riskExplanation}</p>
    </Card>
  );
}
