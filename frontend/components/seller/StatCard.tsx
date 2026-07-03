import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

interface Props {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: "teal" | "orange" | "green";
}

const ACCENTS: Record<NonNullable<Props["accent"]>, string> = {
  teal: "bg-teal-mid/10 text-teal-mid",
  orange: "bg-signal-orange/10 text-signal-orange",
  green: "bg-green-100 text-green-700",
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  accent = "teal",
}: Props) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {title}
          </h3>
          <p className="mt-2 text-3xl font-bold text-teal-deep">{value}</p>
        </div>
        {Icon && (
          <div
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${ACCENTS[accent]}`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>
    </Card>
  );
}
