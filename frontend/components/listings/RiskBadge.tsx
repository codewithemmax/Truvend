import { Badge } from "@/components/ui/badge";
import { RiskLevel } from "@/types/listing";

interface Props {
  level: RiskLevel;
}

// The Truvend brand-token rules (§10 of the architecture guide):
//   caution-yellow: reserved for the "caution" risk badge only.
//   alert-red: reserved for the "high_risk" indicator only.
// "clear" uses a neutral safe green rather than a brand color that means something else.
const styles: Record<RiskLevel, string> = {
  clear: "bg-green-100 text-green-800 border-green-200",
  caution: "bg-caution-yellow/20 text-yellow-900 border-caution-yellow/40",
  suspicious: "bg-signal-orange/15 text-signal-orange border-signal-orange/30",
  high_risk: "bg-alert-red/15 text-alert-red border-alert-red/40",
};

const labels: Record<RiskLevel, string> = {
  clear: "Clear",
  caution: "Caution",
  suspicious: "Suspicious",
  high_risk: "High Risk",
};

export default function RiskBadge({ level }: Props) {
  return (
    <Badge variant="outline" className={`${styles[level]} font-medium`}>
      {labels[level]}
    </Badge>
  );
}
