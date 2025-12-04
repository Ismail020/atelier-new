"use client";

import { createContext, useContext, ReactNode } from "react";
import type { SettingsData } from "@/lib/settings";

const SettingsContext = createContext<SettingsData | null>(null);

export function SettingsProvider({
  children,
  settingsData,
}: {
  children: ReactNode;
  settingsData: SettingsData;
}) {
  return (
    <SettingsContext.Provider value={settingsData}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  return context;
}