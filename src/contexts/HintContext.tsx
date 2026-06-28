"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface HintContextValue {
  hint: string;
  setHint: (h: string) => void;
  clickText: string;
  setClickText: (t: string) => void;
}

const HintContext = createContext<HintContextValue | null>(null);

export function HintProvider({ children }: { children: ReactNode }) {
  const [hint, setHint] = useState("");
  const [clickText, setClickText] = useState("");
  return (
    <HintContext.Provider value={{ hint, setHint, clickText, setClickText }}>
      {children}
    </HintContext.Provider>
  );
}

export function useHint() {
  const ctx = useContext(HintContext);
  if (!ctx) throw new Error("useHint must be used inside HintProvider");
  return ctx;
}
