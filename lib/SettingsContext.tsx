"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext<Record<string, string>>({});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/settings", { signal: ac.signal })
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
    return () => ac.abort();
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
