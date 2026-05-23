"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { defaultSettings } from "./defaults";

const SettingsContext = createContext<Record<string, string>>(defaultSettings);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/settings", { signal: ac.signal })
      .then((r) => r.json())
      .then((data) => setSettings({ ...defaultSettings, ...data }))
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
