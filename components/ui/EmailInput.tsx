"use client";

import { useState } from "react";

interface EmailInputProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  className?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string): string | null {
  if (!value) return null;
  if (!emailRegex.test(value)) return "Please enter a valid email address";
  return null;
}

export default function EmailInput({
  label,
  value = "",
  onChange,
  required,
  className = "",
}: EmailInputProps) {
  const [touched, setTouched] = useState(false);
  const error = touched ? validateEmail(value) : null;

  const inputId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="email"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="info@example.com"
          required={required}
          autoComplete="email"
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
            aria-label="Clear email"
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
