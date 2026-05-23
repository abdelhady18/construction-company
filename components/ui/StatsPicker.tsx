"use client";

import { useCallback, useMemo } from "react";

interface Stat {
  value: string;
  label: string;
}

interface StatsPickerProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const defaultStats: Stat[] = [
  { value: "20+", label: "Years Experience" },
  { value: "50+", label: "Projects Completed" },
  { value: "15+", label: "Expert Team" },
  { value: "100%", label: "Client Satisfaction" },
];

function parseStats(json: string): Stat[] {
  if (!json) return defaultStats;
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed.every((s: any) => typeof s.value === "string" && typeof s.label === "string")) {
      return parsed;
    }
  } catch {}
  return defaultStats;
}

export function formatStatsDisplay(json: string): string {
  const stats = parseStats(json);
  return stats.map((s) => `${s.value} ${s.label}`).join(" | ");
}

export default function StatsPicker({
  label,
  value = "",
  onChange,
  className = "",
}: StatsPickerProps) {
  const stats = useMemo(() => parseStats(value), [value]);

  const updateStat = useCallback(
    (index: number, field: "value" | "label", val: string) => {
      const next = stats.map((s, i) =>
        i === index ? { ...s, [field]: val } : s
      );
      onChange?.(JSON.stringify(next));
    },
    [stats, onChange]
  );

  const addStat = useCallback(() => {
    onChange?.(JSON.stringify([...stats, { value: "", label: "" }]));
  }, [stats, onChange]);

  const removeStat = useCallback(
    (index: number) => {
      onChange?.(JSON.stringify(stats.filter((_, i) => i !== index)));
    },
    [stats, onChange]
  );

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <details className="group">
        <summary className="flex items-center justify-between cursor-pointer list-none">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{label}</span>
            <svg
              className="w-4 h-4 text-muted transition-transform duration-200 group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {formatStatsDisplay(value) && (
            <span className="text-xs text-muted hidden sm:block">
              {formatStatsDisplay(value)}
            </span>
          )}
        </summary>
        <div className="mt-3 space-y-2">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface/50"
            >
              <input
                type="text"
                value={stat.value}
                onChange={(e) => updateStat(i, "value", e.target.value)}
                placeholder="e.g. 15+"
                className="w-20 rounded-lg border border-border px-3 py-1.5 bg-transparent text-sm text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
              />
              <input
                type="text"
                value={stat.label}
                onChange={(e) => updateStat(i, "label", e.target.value)}
                placeholder="e.g. Years Experience"
                className="flex-1 rounded-lg border border-border px-3 py-1.5 bg-transparent text-sm text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
              />
              <button
                type="button"
                onClick={() => removeStat(i)}
                className="px-2 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStat}
            className="px-4 py-2 text-sm font-medium text-accent bg-accent/10 rounded-lg hover:bg-accent/20 cursor-pointer"
          >
            Add Stat
          </button>
        </div>
      </details>
    </div>
  );
}
