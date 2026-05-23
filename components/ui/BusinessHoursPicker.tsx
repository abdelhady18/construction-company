"use client";

import { useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";

interface DayHours {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

interface BusinessHoursPickerProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const defaultDays: DayHours[] = [
  { day: "Monday", open: "08:00", close: "18:00", closed: false },
  { day: "Tuesday", open: "08:00", close: "18:00", closed: false },
  { day: "Wednesday", open: "08:00", close: "18:00", closed: false },
  { day: "Thursday", open: "08:00", close: "18:00", closed: false },
  { day: "Friday", open: "08:00", close: "18:00", closed: false },
  { day: "Saturday", open: "09:00", close: "13:00", closed: false },
  { day: "Sunday", open: "09:00", close: "13:00", closed: true },
];

function parseHours(json: string): DayHours[] {
  if (!json) return defaultDays;
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed.every((d: any) => d.day)) {
      return parsed;
    }
  } catch {}
  return defaultDays;
}

export function formatHoursDisplay(
  json: string,
  locale?: string
): string {
  const days = parseHours(json);
  const groups: { open: string; close: string; closed: boolean; days: string[] }[] = [];
  const isArabic = locale === "ar";
  const dayAbbr: Record<string, string> = isArabic
    ? { Monday: "إثن", Tuesday: "ثلاث", Wednesday: "أربع", Thursday: "خميس", Friday: "جمعة", Saturday: "سبت", Sunday: "أحد" }
    : { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun" };
  const closedLabel = isArabic ? "مغلق" : "Closed";

  for (const d of days) {
    const existing = groups.find(
      (g) => g.open === d.open && g.close === d.close && g.closed === d.closed
    );
    if (existing) {
      existing.days.push(d.day);
    } else {
      groups.push({ open: d.open, close: d.close, closed: d.closed, days: [d.day] });
    }
  }

  function fmtTime(time: string): string {
    if (!time) return "";
    if (isArabic) return time;
    const [h, m] = time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  }

  return groups
    .map((g) => {
      const labels = g.days.map((d) => dayAbbr[d] || d);
      const range = labels.length > 2
        ? `${labels[0]}-${labels[labels.length - 1]}`
        : labels.join(", ");
      if (g.closed) return `${range}: ${closedLabel}`;
      return `${range}: ${fmtTime(g.open)} - ${fmtTime(g.close)}`;
    })
    .join(" | ");
}

export default function BusinessHoursPicker({
  label,
  value = "",
  onChange,
  className = "",
}: BusinessHoursPickerProps) {
  const t = useTranslations("businessHours");
  const days = useMemo(() => parseHours(value), [value]);

  const updateDay = useCallback(
    (index: number, field: keyof DayHours, val: string | boolean) => {
      const next = days.map((d, i) =>
        i === index ? { ...d, [field]: val } : d
      );
      onChange?.(JSON.stringify(next));
    },
    [days, onChange]
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
          {(() => { const display = formatHoursDisplay(value); return display ? (
            <span className="text-xs text-muted hidden sm:block">{display}</span>
          ) : null; })()}
        </summary>
        <div className="mt-3 space-y-2">
          {days.map((day, i) => (
            <div
              key={day.day}
              className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface/50"
            >
              <span className="w-20 text-sm font-medium text-foreground shrink-0">
                {t(`abbr.${day.day}`)}
              </span>
              <label className="flex items-center gap-2 text-sm text-muted shrink-0">
                <input
                  type="checkbox"
                  checked={day.closed}
                  onChange={(e) => updateDay(i, "closed", e.target.checked)}
                  className="rounded border-border accent-accent"
                />
                {t("closed")}
              </label>
              {!day.closed && (
                <>
                  <input
                    type="time"
                    value={day.open}
                    onChange={(e) => updateDay(i, "open", e.target.value)}
                    aria-label={t("openAria", { day: t(`day.${day.day}`) })}
                    className="flex-1 max-w-[140px] rounded-lg border border-border px-3 py-1.5 bg-transparent text-sm text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                  />
                  <span className="text-muted text-sm">{t("to")}</span>
                  <input
                    type="time"
                    value={day.close}
                    onChange={(e) => updateDay(i, "close", e.target.value)}
                    aria-label={t("closeAria", { day: t(`day.${day.day}`) })}
                    className="flex-1 max-w-[140px] rounded-lg border border-border px-3 py-1.5 bg-transparent text-sm text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
