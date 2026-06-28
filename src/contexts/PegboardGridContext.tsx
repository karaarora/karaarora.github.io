"use client";

import { createContext, useContext, useRef, RefObject } from "react";

export const HOLE_SIZE    = 40;
export const SAFE_PADDING = { top: 20, right: 40, bottom: 20, left: 40 };

// ── Collision registry ────────────────────────────────────────────────────────
interface CharmEntry { col: number; row: number; cols: number; rows: number }

function overlaps(
  aCol: number, aRow: number, aCols: number, aRows: number,
  bCol: number, bRow: number, bCols: number, bRows: number,
): boolean {
  return aCol < bCol + bCols && aCol + aCols > bCol &&
         aRow < bRow + bRows && aRow + aRows > bRow;
}

// ── Context ───────────────────────────────────────────────────────────────────
interface PegboardGridContextValue {
  innerRef:        RefObject<HTMLDivElement | null>;
  registerCharm:   (id: string, col: number, row: number, cols: number, rows: number) => void;
  unregisterCharm: (id: string) => void;
  /** Returns true if the given rect doesn't overlap any other registered charm */
  isAvailable:     (excludeId: string, col: number, row: number, cols: number, rows: number) => boolean;
}

const PegboardGridContext = createContext<PegboardGridContextValue | null>(null);

export function PegboardGridProvider({ children }: { children: React.ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const registry = useRef<Map<string, CharmEntry>>(new Map());

  const registerCharm = (id: string, col: number, row: number, cols: number, rows: number) => {
    registry.current.set(id, { col, row, cols, rows });
  };

  const unregisterCharm = (id: string) => {
    registry.current.delete(id);
  };

  const isAvailable = (excludeId: string, col: number, row: number, cols: number, rows: number): boolean => {
    for (const [id, e] of registry.current) {
      if (id === excludeId) continue;
      if (overlaps(col, row, cols, rows, e.col, e.row, e.cols, e.rows)) return false;
    }
    return true;
  };

  return (
    <PegboardGridContext.Provider value={{ innerRef, registerCharm, unregisterCharm, isAvailable }}>
      {children}
    </PegboardGridContext.Provider>
  );
}

export function usePegboardGrid() {
  const ctx = useContext(PegboardGridContext);
  if (!ctx) throw new Error("usePegboardGrid must be used inside PegboardGridProvider");
  return ctx;
}
