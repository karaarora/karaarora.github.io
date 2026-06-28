"use client";

import { useWallColor } from "@/contexts/WallColorContext";
import { usePegboardGrid, HOLE_SIZE, SAFE_PADDING } from "@/contexts/PegboardGridContext";
import { useHint } from "@/contexts/HintContext";
import { useRef, useState, useEffect, useCallback, useId } from "react";

export { HOLE_SIZE };

const HOLE_OFFSET = HOLE_SIZE / 2;
const PIVOT_X     = HOLE_OFFSET;
const PIVOT_Y     = 0;
const SPRING      = 0.018;
const DAMPING     = 0.96;

export const WALL_COLORS = [
  { label: "Warm Gray",  value: "#c2bfba" },
  { label: "Sage",       value: "#8a9e88" },
  { label: "Dusty Blue", value: "#8a9eb5" },
  { label: "Terracotta", value: "#c4876a" },
  { label: "Cream",      value: "#ddd8ce" },
  { label: "Slate",      value: "#6a7a8a" },
];

interface ColorCharmProps {
  col?: number;
  row?: number;
  onMove?: (col: number, row: number) => void;
  cols?: number;
  rows?: number;
  hint?: string;
}

export default function ColorCharm({
  col: initialCol = 0,
  row: initialRow = 0,
  onMove,
  cols = 2,
  rows = 2,
  hint,
}: ColorCharmProps) {
  const { color, setColor } = useWallColor();
  const { innerRef, registerCharm, unregisterCharm, isAvailable } = usePegboardGrid();
  const { setHint } = useHint();
  const id = useId();

  const width  = cols * HOLE_SIZE;
  const height = rows * HOLE_SIZE;

  const currentIndex = WALL_COLORS.findIndex((c) => c.value === color);
  const nextColor    = WALL_COLORS[(currentIndex + 1) % WALL_COLORS.length];

  const [col, setCol] = useState(initialCol);
  const [row, setRow] = useState(initialRow);
  useEffect(() => { setCol(initialCol); }, [initialCol]);
  useEffect(() => { setRow(initialRow); }, [initialRow]);

  useEffect(() => { registerCharm(id, col, row, cols, rows); }, [id, col, row, cols, rows]);
  useEffect(() => () => unregisterCharm(id), [id]);

  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [angle,   setAngle]   = useState(0);
  const [pressed, setPressed] = useState(false);
  const [moving,  setMoving]  = useState(false);
  const [hovered, setHovered] = useState(false);

  const angleRef    = useRef(0);
  const velocityRef = useRef(0);
  const rafRef      = useRef<number | null>(null);
  const didDrag     = useRef(false);

  const animate = useCallback(() => {
    const force = -SPRING * angleRef.current;
    velocityRef.current = velocityRef.current * DAMPING + force;
    angleRef.current   += velocityRef.current;
    setAngle(angleRef.current);
    if (Math.abs(angleRef.current) > 0.05 || Math.abs(velocityRef.current) > 0.05) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      angleRef.current = velocityRef.current = 0;
      setAngle(0);
    }
  }, []);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  // ── Whole-charm drag → MOVE (or click → sway) ────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const inner = innerRef.current;
    if (!inner) return;

    didDrag.current = false;

    // Give a sway kick on click — direction based on click side of pivot, fixed magnitude
    const innerRectInit = inner.getBoundingClientRect();
    const clickX = e.clientX - innerRectInit.left;
    const kickDir = (clickX - PIVOT_X) >= 0 ? 1 : -1;
    velocityRef.current += kickDir * 1.5;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);

    const DRAG_THRESHOLD = 8; // px before drag mode activates
    let wasDragging = false;
    let finalCol    = col;
    let finalRow    = row;
    let lastX       = e.clientX;
    const startCol  = col;
    const startRow  = row;
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;


    const onMouseMove = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - startMouseX, e.clientY - startMouseY);
      if (!wasDragging) {
        if (dist < DRAG_THRESHOLD) return; // still in sway-only zone
        // Transition to drag mode once threshold is crossed
        wasDragging = true;
        didDrag.current = true;
        setPressed(false);
        setMoving(true);
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      }

      const innerRect = inner.getBoundingClientRect();
      const outerRect = (inner.parentElement ?? inner).getBoundingClientRect();

      const x = e.clientX - innerRect.left - HOLE_OFFSET;
      const y = e.clientY - innerRect.top;
      setDragPos({ x, y });

      const maxCol = Math.max(0, Math.floor((outerRect.width  - SAFE_PADDING.left - HOLE_OFFSET) / HOLE_SIZE));
      const maxRow = Math.max(0, Math.floor((outerRect.height - SAFE_PADDING.top)               / HOLE_SIZE));
      finalCol = Math.max(0, Math.min(maxCol, Math.round(x / HOLE_SIZE)));
      finalRow = Math.max(0, Math.min(maxRow, Math.round(y / HOLE_SIZE)));

      const dx = e.clientX - lastX;
      lastX = e.clientX;
      velocityRef.current = velocityRef.current * 0.6 + (dx * 2.5 - angleRef.current) * 0.25;
      angleRef.current   += velocityRef.current;
      setAngle(angleRef.current);
    };

    const onMouseUp = () => {
      setPressed(false);
      if (wasDragging) {
        const targetCol = isAvailable(id, finalCol, finalRow, cols, rows) ? finalCol : startCol;
        const targetRow = isAvailable(id, finalCol, finalRow, cols, rows) ? finalRow : startRow;
        setDragPos(null);
        setCol(targetCol);
        setRow(targetRow);
        setMoving(false);
        onMove?.(targetCol, targetRow);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(animate);
      }
      // If just a click: sway animation is already running from the kick above
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
  };

  // ── Disc click → CHANGE color ─────────────────────────────────────────────
  const handleDiscClick = () => {
    if (!didDrag.current) setColor(nextColor.value);
  };

  return (
    <div
      onMouseEnter={() => { setHovered(true); if (hint) setHint(hint); }}
      onMouseLeave={() => { setHovered(false); setHint(""); }}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: dragPos ? dragPos.x : col * HOLE_SIZE,
        top:  dragPos ? dragPos.y : row * HOLE_SIZE,
        width,
        height,
        transform: `rotate(${angle}deg)`,
        transformOrigin: `${PIVOT_X}px ${PIVOT_Y}px`,
        userSelect: "none",
        cursor: moving ? "grabbing" : "grab",
        zIndex: moving ? 100 : 1,
      }}
    >
      {/* ── Hook (visual only) ── */}
      <div style={{
        position: "absolute", top: 0, left: HOLE_OFFSET,
        transform: "translateX(-50%)", width: 30, height: 26, zIndex: 2,
      }}>
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 7, height: 26, borderRadius: "3px 3px 0 0",
          background: "linear-gradient(90deg, rgba(255,255,255,0.45) 0%, #d4d0cc 15%, #a8a4a0 55%, #6c6864 100%)",
          boxShadow: "1px 0 2px rgba(0,0,0,0.25)",
        }} />
        <div style={{
          position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
          width: 12, height: 12, borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%, rgba(90,85,80,0.5) 0%, #0a0a09 45%)",
          zIndex: 1,
        }} />
      </div>

      {/* ── Disc — click to change color ── */}
      <div
        onMouseDown={() => setPressed(true)}  // bubbles up to outer div for move
        onClick={handleDiscClick}
        title={`Next: ${nextColor.label}`}
        style={{
          position: "absolute",
          top: 23, left: HOLE_OFFSET,
          transform: "translateX(-50%)",
          width: 48, height: 48,
          borderRadius: "50%",
          background: color,
          border: "2px solid rgba(255,255,255,0.5)",
          cursor: "pointer",
          transition: "box-shadow 0.15s ease, background 0.3s ease",
          boxShadow: pressed
            ? "0 0 14px rgba(255,255,255,0.9), 0 0 6px rgba(255,255,255,0.6), inset 0 0 10px rgba(255,255,255,0.35)"
            : hovered
            ? "0 4px 10px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.35), 0 0 0 3px rgba(99,155,255,0.5)"
            : "0 4px 10px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
          <path d="M5 0 C5 0 0 6 0 8.5 A5 5 0 0 0 10 8.5 C10 6 5 0 5 0Z" fill="rgba(255,255,255,0.6)" />
        </svg>
      </div>
    </div>
  );
}
