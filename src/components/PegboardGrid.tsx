"use client";

import React from "react";
import {
  PegboardGridProvider,
  usePegboardGrid,
  SAFE_PADDING,
} from "@/contexts/PegboardGridContext";

interface PegboardGridProps {
  children?: React.ReactNode;
  /** Extra padding on top of the safe default, in pixels */
  padding?: { top?: number; right?: number; bottom?: number; left?: number };
}

function PegboardGridInner({ children, padding = {} }: PegboardGridProps) {
  const { innerRef } = usePegboardGrid();

  const p = {
    top:    SAFE_PADDING.top    + (padding.top    ?? 0),
    right:  SAFE_PADDING.right  + (padding.right  ?? 0),
    bottom: SAFE_PADDING.bottom + (padding.bottom ?? 0),
    left:   SAFE_PADDING.left   + (padding.left   ?? 0),
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`,
        overflow: "visible",
      }}
    >
      {/* innerRef points here — charms calculate snap positions relative to this */}
      <div ref={innerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

export default function PegboardGrid(props: PegboardGridProps) {
  return (
    <PegboardGridProvider>
      <PegboardGridInner {...props} />
    </PegboardGridProvider>
  );
}
