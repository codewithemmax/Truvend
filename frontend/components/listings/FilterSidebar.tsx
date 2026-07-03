"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RiskLevel } from "@/types/listing";

export type SortBy = "newest" | "price_asc" | "price_desc" | "risk_asc";

export interface FilterState {
  riskLevels: RiskLevel[];
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: SortBy;
}

export const DEFAULT_FILTERS: FilterState = {
  riskLevels: [],
  minPrice: null,
  maxPrice: null,
  sortBy: "newest",
};

const RISK_OPTIONS: { level: RiskLevel; label: string }[] = [
  { level: "clear", label: "Clear" },
  { level: "caution", label: "Caution" },
  { level: "suspicious", label: "Suspicious" },
  { level: "high_risk", label: "High Risk" },
];

interface Props {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}

export default function FilterSidebar({ filters, onChange }: Props) {
  function toggleRisk(level: RiskLevel) {
    const has = filters.riskLevels.includes(level);
    onChange({
      ...filters,
      riskLevels: has
        ? filters.riskLevels.filter((l) => l !== level)
        : [...filters.riskLevels, level],
    });
  }

  function applyPrice(min: string, max: string) {
    onChange({
      ...filters,
      minPrice: min ? Number(min) : null,
      maxPrice: max ? Number(max) : null,
    });
  }

  return (
    <aside className="w-full shrink-0 border-r border-gray-200 bg-white p-6 md:sticky md:top-0 md:h-[calc(100vh-4rem)] md:w-60 md:overflow-y-auto">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-teal-deep">
        Filters
      </h2>

      <Separator className="my-4" />

      {/* Risk Level */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-teal-deep">Risk Level</h3>
        <div className="flex flex-col gap-2">
          {RISK_OPTIONS.map(({ level, label }) => (
            <label
              key={level}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={filters.riskLevels.includes(level)}
                onChange={() => toggleRisk(level)}
                className="h-4 w-4 rounded border-gray-300 accent-teal-mid"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Price Range */}
      <PriceRange
        min={filters.minPrice}
        max={filters.maxPrice}
        onApply={applyPrice}
      />

      <Separator className="my-4" />

      {/* Sort By */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-teal-deep">Sort By</h3>
        <select
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value as SortBy })}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-teal-deep focus:border-teal-mid focus:outline-none focus:ring-1 focus:ring-teal-mid"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="risk_asc">Risk: Low → High</option>
        </select>
      </div>
    </aside>
  );
}

// Local uncontrolled sub-component so typing in the price inputs doesn't
// re-filter on every keystroke — the caller only sees a change on "Go".
function PriceRange({
  min,
  max,
  onApply,
}: {
  min: number | null;
  max: number | null;
  onApply: (min: string, max: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-teal-deep">Price Range (₦)</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const minInput = form.elements.namedItem("min") as HTMLInputElement;
          const maxInput = form.elements.namedItem("max") as HTMLInputElement;
          onApply(minInput.value, maxInput.value);
        }}
        className="flex flex-col gap-2"
      >
        <div className="flex gap-2">
          <Input
            name="min"
            type="number"
            placeholder="Min"
            defaultValue={min ?? ""}
            className="h-9"
          />
          <Input
            name="max"
            type="number"
            placeholder="Max"
            defaultValue={max ?? ""}
            className="h-9"
          />
        </div>
        <Button type="submit" variant="outline" size="sm" className="w-full">
          Go
        </Button>
      </form>
    </div>
  );
}
