"use client";

import { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface WallColorContextValue {
  color: string;
  setColor: (color: string) => void;
}

const WallColorContext = createContext<WallColorContextValue | null>(null);

export function WallColorProvider({
  children,
  defaultColor = "#c2bfba",
}: {
  children: ReactNode;
  defaultColor?: string;
}) {
  const [color, setColor] = useLocalStorage("pegboard-wall-color", defaultColor);
  return (
    <WallColorContext.Provider value={{ color, setColor }}>
      {children}
    </WallColorContext.Provider>
  );
}

export function useWallColor() {
  const ctx = useContext(WallColorContext);
  if (!ctx) throw new Error("useWallColor must be used inside WallColorProvider");
  return ctx;
}
