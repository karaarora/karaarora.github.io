import React from "react";

const SLOT_ANGLES: Record<string, number> = {
  tl: 42, tr: 118, bl: 205, br: 73,
};

interface ScrewProps {
  corner: "tl" | "tr" | "bl" | "br";
  inset?: number; // px from edge, default 10
}

export default function Screw({ corner, inset = 10 }: ScrewProps) {
  const pos = {
    tl: { top: inset,    left: inset  },
    tr: { top: inset,    right: inset },
    bl: { bottom: inset, left: inset  },
    br: { bottom: inset, right: inset },
  }[corner] as React.CSSProperties;

  return (
    <div style={{ position: "absolute", ...pos, width: 16, height: 16 }}>
      {/* Cast shadow */}
      <div style={{
        position: "absolute", inset: "-1px", borderRadius: "50%",
        background: "radial-gradient(circle at 40% 40%, transparent 45%, rgba(0,0,0,0.2) 100%)",
        filter: "blur(1.5px)", transform: "translateY(1px)",
      }} />
      {/* Body */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `radial-gradient(circle at 38% 32%,
          #e8e8e4 0%, #d0cfcb 25%, #b0aeaa 55%, #949290 75%, #7a7876 100%)`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.28), 0 2px 5px rgba(0,0,0,0.12)",
      }} />
      {/* Slot */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: `rotate(${SLOT_ANGLES[corner]}deg)`,
      }}>
        <div style={{ position: "relative", width: 10, height: 2 }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 100%)",
            borderRadius: "1px",
          }} />
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "1px",
            background: "rgba(255,255,255,0.15)", borderRadius: "1px",
          }} />
        </div>
      </div>
    </div>
  );
}
