"use client";

import { useState } from "react";

interface PhoneInputProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  className?: string;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 1) return `+${digits}`;
  if (digits.length <= 4) return `+${digits[0]} (${digits.slice(1)}`;
  if (digits.length <= 7) return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
  return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
}

function validatePhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length < 11) return "Phone must be 10 digits after country code";
  return null;
}

export default function PhoneInput({
  label,
  value = "",
  onChange,
  required,
  className = "",
}: PhoneInputProps) {
  const [touched, setTouched] = useState(false);
  const error = touched ? validatePhone(value) : null;

  function handleChange(raw: string) {
    const formatted = formatPhone(raw);
    onChange?.(formatted);
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="tel"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="+1 (555) 123-4567"
          required={required}
          className={`w-full rounded-lg border px-4 py-2.5 bg-transparent text-foreground placeholder:text-muted/60 outline-none transition ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-border focus:border-accent focus:ring-2 focus:ring-accent/20"
          }`}
        />
        {value && (
          <button
            type="button"
            onClick={() => { onChange?.(""); setTouched(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors text-sm"
            aria-label="Clear phone"
          >
            ✕
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
