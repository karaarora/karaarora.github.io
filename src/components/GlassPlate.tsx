"use client";

import React, { useEffect, useId } from "react";
import { usePegboardGrid, HOLE_SIZE } from "@/contexts/PegboardGridContext";
import Screw from "@/components/Screw";

interface GlassPlateProps {
  text: string;
  col?: number;
  row?: number;
  cols?: number;
  rows?: number;
}

export default function GlassPlate({
  text,
  col  = 0,
  row  = 0,
  cols = 8,
  rows = 2,
}: GlassPlateProps) {
  const { registerCharm, unregisterCharm } = usePegboardGrid();
  const id = useId();

  const width  = cols * HOLE_SIZE;
  const height = rows * HOLE_SIZE;

  useEffect(() => {
    registerCharm(id, col, row, cols, rows);
  }, [id, col, row, cols, rows]);

  useEffect(() => () => unregisterCharm(id), [id]);

  return (
    <div style={{
      position: "absolute",
      left: col * HOLE_SIZE,
      top:  row  * HOLE_SIZE,
      width,
      height,
      borderRadius: 16,
      background: `linear-gradient(
        135deg,
        rgba(255,255,255,0.28) 0%,
        rgba(255,255,255,0.08) 40%,
        rgba(255,255,255,0.14) 100%
      )`,
      backdropFilter:       "blur(8px) saturate(150%) brightness(1.04)",
      WebkitBackdropFilter: "blur(8px) saturate(150%) brightness(1.04)",
      border: "1px solid rgba(255,255,255,0.45)",
      boxShadow: `
        0 16px 48px rgba(0,0,0,0.22),
        0  4px 12px rgba(0,0,0,0.12),
        inset  0  1.5px 0 rgba(255,255,255,0.9),
        inset  0 -1.5px 0 rgba(0,0,0,0.06),
        inset  1.5px 0  0 rgba(255,255,255,0.45),
        inset -1.5px 0  0 rgba(0,0,0,0.05)
      `,
    }}>
      {/* Top specular sheen */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "48%",
        borderRadius: "16px 16px 60% 60% / 16px 16px 28px 28px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%)",
        pointerEvents: "none",
      }} />
      {/* Inner depth */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 16,
        boxShadow: "inset 0 -6px 16px rgba(0,0,0,0.07), inset 0 6px 16px rgba(255,255,255,0.25)",
        pointerEvents: "none",
      }} />
      {/* Caustic glow */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 16,
        background: "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(255,255,255,0.18) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <Screw corner="tl" />
      <Screw corner="tr" />
      <Screw corner="bl" />
      <Screw corner="br" />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "-0.025em",
          color: "rgba(28,26,24,0.82)",
          textShadow: "0 1px 3px rgba(255,255,255,0.7), 0 -1px 1px rgba(0,0,0,0.08)",
          userSelect: "none",
        }}>
          {text}
        </span>
      </div>
    </div>
  );
}
