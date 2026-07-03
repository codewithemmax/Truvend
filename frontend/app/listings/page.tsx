"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

import FilterSidebar, {
  DEFAULT_FILTERS,
  FilterState,
} from "@/components/listings/FilterSidebar";
import ListingsGrid from "@/components/listings/ListingsGrid";
import SearchBar from "@/components/listings/SearchBar";
import Loading from "@/components/common/Loading";
import useListings from "@/hooks/useListings";
import { DefaultSearchStrategy } from "@/strategies/SearchStrategy";
import { formatCurrency } from "@/lib/utils";
import { Listing, RiskLevel } from "@/types/listing";

const searchStrategy = new DefaultSearchStrategy();

const RISK_ORDER: Record<RiskLevel, number> = {
  clear: 0,
  caution: 1,
  suspicious: 2,
  high_risk: 3,
};

const RISK_LABELS: Record<RiskLevel, string> = {
  clear: "Clear",
  caution: "Caution",
  suspicious: "Suspicious",
  high_risk: "High Risk",
};

function applyFilters(
  listings: Listing[],
  query: string,
  filters: FilterState
): Listing[] {
  let result = query ? searchStrategy.search(listings, query) : listings;

  if (filters.riskLevels.length > 0) {
    result = result.filter((l) => filters.riskLevels.includes(l.riskLevel));
  }

  if (filters.minPrice !== null) {
    result = result.filter((l) => l.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== null) {
    result = result.filter((l) => l.price <= filters.maxPrice!);
  }

  switch (filters.sortBy) {
    case "price_asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "risk_asc":
      result = [...result].sort(
        (a, b) => RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel]
      );
      break;
    // "newest" preserves API order (backend returns created_at DESC)
  }

  return result;
}

export default function ListingsPage() {
  const { listings, loading, error } = useListings();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const filtered = useMemo(
    () => applyFilters(listings, query, filters),
    [listings, query, filters]
  );

  const activePills = useMemo(() => {
    const pills: { key: string; label: string; onRemove: () => void }[] = [];

    filters.riskLevels.forEach((level) => {
      pills.push({
        key: `risk-${level}`,
        label: RISK_LABELS[level],
        onRemove: () =>
          setFilters((f) => ({
            ...f,
            riskLevels: f.riskLevels.filter((l) => l !== level),
          })),
      });
    });

    if (filters.minPrice !== null) {
      pills.push({
        key: "min",
        label: `Min ${formatCurrency(filters.minPrice)}`,
        onRemove: () => setFilters((f) => ({ ...f, minPrice: null })),
      });
    }

    if (filters.maxPrice !== null) {
      pills.push({
        key: "max",
        label: `Max ${formatCurrency(filters.maxPrice)}`,
        onRemove: () => setFilters((f) => ({ ...f, maxPrice: null })),
      });
    }

    return pills;
  }, [filters]);

  return (
    <div className="flex flex-col md:flex-row">
      <FilterSidebar filters={filters} onChange={setFilters} />

      <main className="flex-1 p-6 md:p-8">
        <h1 className="mb-4 text-3xl font-bold text-teal-deep">
          Marketplace Listings
        </h1>

        <SearchBar onSearch={setQuery} defaultValue={query} />

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">
            {filtered.length} {filtered.length === 1 ? "listing" : "listings"}
          </span>

          {activePills.length > 0 && (
            <span className="text-sm text-gray-400">·</span>
          )}

          {activePills.map((pill) => (
            <button
              key={pill.key}
              onClick={pill.onRemove}
              className="inline-flex items-center gap-1 rounded-full border border-teal-mid/30 bg-teal-mid/10 px-3 py-1 text-xs font-medium text-teal-deep transition hover:bg-teal-mid/20"
            >
              {pill.label}
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          ))}
        </div>

        {loading && <Loading />}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && <ListingsGrid listings={filtered} />}
      </main>
    </div>
  );
}
