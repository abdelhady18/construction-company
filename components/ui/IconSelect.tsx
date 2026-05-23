"use client";

import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/Icon";

export interface IconOption {
  value: string;
  icon: string;
}

interface IconSelectProps {
  options: IconOption[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  label?: string;
}

export default function IconSelect({
  options,
  value,
  onChange,
  name,
  label,
}: IconSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) || options[0];
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        setActiveIndex(0);
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeIndex >= 0) {
          onChange?.(options[activeIndex].value);
        }
        setOpen(false);
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  }

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <div className="relative">
        <input type="hidden" name={name} value={selected.value} />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="w-full flex items-center gap-3 rounded-lg border border-border px-4 py-2.5 bg-transparent text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition cursor-pointer"
        >
          <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
            <Icon name={selected.icon as any} size={14} className="text-accent" />
          </div>
          <span className="flex-1 text-left text-sm">{selected.value}</span>
          <svg
            className={`w-4 h-4 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div
            className="absolute top-full left-0 right-0 mt-1 z-20 rounded-lg border border-border bg-surface shadow-xl max-h-60 overflow-y-auto"
            role="listbox"
          >
            {options.map((opt, i) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={opt.value === selected.value}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                  i === activeIndex
                    ? "bg-accent/10 text-accent"
                    : "text-foreground hover:bg-background"
                }`}
              >
                <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
                  <Icon name={opt.icon as any} size={14} className="text-accent" />
                </div>
                {opt.value}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
