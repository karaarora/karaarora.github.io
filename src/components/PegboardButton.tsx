"use client";

import { useEffect, useId, useState, ReactNode } from "react";
import { usePegboardGrid, HOLE_SIZE } from "@/contexts/PegboardGridContext";
import { useHint } from "@/contexts/HintContext";

interface PegboardButtonProps {
  col?: number;
  row?: number;
  icon: ReactNode;
  hint?: string;
  onClick?: () => void;
}

// The button is centered on the hole (col * HOLE_SIZE + HOLE_SIZE/2)
const HOLE_OFFSET = HOLE_SIZE / 2;
const SOCKET_D = 28; // outer mounting ring diameter
const CAP_D    = 24; // pressable cap diameter

export default function PegboardButton({
  col = 0,
  row = 0,
  icon,
  hint,
  onClick,
}: PegboardButtonProps) {
  const { registerCharm, unregisterCharm } = usePegboardGrid();
  const { setHint } = useHint();
  const id = useId();

  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => { registerCharm(id, col, row, 1, 1); }, [id, col, row]);
  useEffect(() => () => unregisterCharm(id), [id]);

  // Holes in inner-grid coordinates:
  //   X: HOLE_OFFSET + col * HOLE_SIZE  (SAFE_PADDING.left = 40 = 1 full tile)
  //   Y: row * HOLE_SIZE                (SAFE_PADDING.top  = 20 = half tile → first hole is at y=0)
  const cx = col * HOLE_SIZE + HOLE_OFFSET;
  const cy = row * HOLE_SIZE;

  const capShift   = pressed ? 2 : hovered ? -1 : 0;
  const shadowSize = pressed ? 1 : hovered ? 6 : 4;

  return (
    <div
      style={{
        position: "absolute",
        left: cx - SOCKET_D / 2,
        top:  cy - SOCKET_D / 2,
        width:  SOCKET_D,
        height: SOCKET_D,
        cursor: "pointer",
        userSelect: "none",
      }}
      onMouseEnter={() => { setHovered(true);  if (hint) setHint(hint); }}
      onMouseLeave={() => { setHovered(false); setPressed(false); setHint(""); }}
      onMouseDown={e  => { e.preventDefault(); setPressed(true); }}
      onMouseUp={() => { setPressed(false); onClick?.(); }}
    >
      {/* ── Mounting socket — sits flush in the hole ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 35%, #1c1f24 0%, #0a0c0f 60%)",
        boxShadow: [
          "inset 0 2px 5px rgba(0,0,0,0.95)",
          "inset 0 -1px 2px rgba(255,255,255,0.04)",
          "0 0 0 1px rgba(0,0,0,0.5)",
        ].join(", "),
      }} />

      {/* ── Pressable cap — protrudes above the board ── */}
      <div style={{
        position: "absolute",
        top:  (SOCKET_D - CAP_D) / 2,
        left: (SOCKET_D - CAP_D) / 2,
        width:  CAP_D,
        height: CAP_D,
        borderRadius: "50%",
        background: "linear-gradient(145deg, #3d4451 0%, #292e38 50%, #1f232a 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: [
          "inset 0 1.5px 0 rgba(255,255,255,0.16)",
          "inset 0 -1px 0 rgba(0,0,0,0.4)",
          `0 ${shadowSize}px 0 rgba(0,0,0,0.7)`,
          `0 ${shadowSize + 4}px 10px rgba(0,0,0,0.45)`,
          hovered && !pressed
            ? "0 0 0 2px rgba(99,155,255,0.3)"
            : "",
        ].filter(Boolean).join(", "),
        transform: `translateY(${capShift}px)`,
        transition: "transform 0.07s ease, box-shadow 0.08s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {icon}
      </div>
    </div>
  );
}
