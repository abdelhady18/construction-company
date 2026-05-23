"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { defaultSettings } from "./defaults";
import { fetchWithCache } from "./api-cache";

const SettingsContext = createContext<Record<string, string>>(defaultSettings);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    fetchWithCache<Record<string, string>>("/api/settings")
      .then((data) => setSettings({ ...defaultSettings, ...data }))
      .catch(() => {});
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
