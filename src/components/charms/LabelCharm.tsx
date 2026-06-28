"use client";

import { usePegboardGrid, HOLE_SIZE, SAFE_PADDING } from "@/contexts/PegboardGridContext";
import { useRef, useState, useEffect, useCallback, useId } from "react";

const HOOK_OFFSET = HOLE_SIZE / 2;
const SPRING      = 0.025;
const DAMPING     = 0.88;
const MAX_ANGLE   = 3;

interface LabelCharmProps {
  col?: number;
  row?: number;
  onMove?: (col: number, row: number) => void;
  cols?: number;
  rows?: number;
  text?: string;
}

function Hook({ x }: { x: number }) {
  return (
    <div style={{
      position: "absolute", top: 0, left: x,
      transform: "translateX(-50%)", width: 30, height: 26,
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
  );
}

export default function LabelCharm({
  col: initialCol = 0,
  row: initialRow = 0,
  onMove,
  cols = 3,
  rows = 2,
  text = "Text",
}: LabelCharmProps) {
  const { innerRef, registerCharm, unregisterCharm, isAvailable } = usePegboardGrid();
  const id = useId();

  const width  = cols * HOLE_SIZE;
  const pivotX = width / 2;

  const [col, setCol] = useState(initialCol);
  const [row, setRow] = useState(initialRow);
  useEffect(() => { setCol(initialCol); }, [initialCol]);
  useEffect(() => { setRow(initialRow); }, [initialRow]);

  useEffect(() => { registerCharm(id, col, row, cols, rows); }, [id, col, row, cols, rows]);
  useEffect(() => () => unregisterCharm(id), [id]);

  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [angle,   setAngle]   = useState(0);
  const [moving,  setMoving]  = useState(false);

  const angleRef    = useRef(0);
  const velocityRef = useRef(0);
  const rafRef      = useRef<number | null>(null);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const inner = innerRef.current;
    if (!inner) return;

    setMoving(true);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    let finalCol   = col;
    let finalRow   = row;
    let lastX      = e.clientX;
    const startCol = col;
    const startRow = row;

    const innerRectInit = inner.getBoundingClientRect();
    const grabOffsetX   = e.clientX - innerRectInit.left - col * HOLE_SIZE;
    const grabOffsetY   = e.clientY - innerRectInit.top  - row * HOLE_SIZE;

    const onMouseMove = (e: MouseEvent) => {
      const innerRect = inner.getBoundingClientRect();
      const outerRect = (inner.parentElement ?? inner).getBoundingClientRect();

      const x     = e.clientX - innerRect.left - grabOffsetX;
      const y     = e.clientY - innerRect.top  - grabOffsetY;
      const hookX = x + HOOK_OFFSET;
      setDragPos({ x, y });

      const maxCol = Math.max(0,
        Math.floor((outerRect.width  - SAFE_PADDING.left - HOOK_OFFSET) / HOLE_SIZE) - (cols - 1)
      );
      const maxRow = Math.max(0,
        Math.floor((outerRect.height - SAFE_PADDING.top) / HOLE_SIZE)
      );
      finalCol = Math.max(0, Math.min(maxCol, Math.round(hookX / HOLE_SIZE)));
      finalRow = Math.max(0, Math.min(maxRow, Math.round(y    / HOLE_SIZE)));

      const dx = e.clientX - lastX;
      lastX = e.clientX;
      const target = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, dx * 1.2));
      velocityRef.current = velocityRef.current * 0.6 + (target - angleRef.current) * 0.25;
      angleRef.current   += velocityRef.current;
      setAngle(angleRef.current);
    };

    const onMouseUp = () => {
      const targetCol = isAvailable(id, finalCol, finalRow, cols, rows) ? finalCol : startCol;
      const targetRow = isAvailable(id, finalCol, finalRow, cols, rows) ? finalRow : startRow;
      setDragPos(null);
      setCol(targetCol);
      setRow(targetRow);
      setMoving(false);
      onMove?.(targetCol, targetRow);
      rafRef.current = requestAnimationFrame(animate);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: dragPos ? dragPos.x : col * HOLE_SIZE,
        top:  dragPos ? dragPos.y : row * HOLE_SIZE,
        width,
        height: rows * HOLE_SIZE,
        transform: `rotate(${angle}deg)`,
        transformOrigin: `${pivotX}px 0px`,
        userSelect: "none",
        cursor: moving ? "grabbing" : "grab",
        zIndex: moving ? 100 : 1,
      }}
    >
      <Hook x={HOOK_OFFSET} />
      <Hook x={(cols - 1) * HOLE_SIZE + HOOK_OFFSET} />

      <div style={{
        position: "absolute",
        top: 22, left: 6, right: 6, bottom: 6,
        borderRadius: "8px",
        background: "linear-gradient(160deg, #faf9f7 0%, #eeece8 60%, #e4e1db 100%)",
        boxShadow: "0 6px 16px rgba(0,0,0,0.22), 0 2px 5px rgba(0,0,0,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.7)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "relative",
          padding: "5px 12px",
          background: "#fffef9",
          borderRadius: "3px",
          transform: "rotate(-1.8deg)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.07)",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "11px",
          fontWeight: 500,
          color: "#2a2826",
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}>
          {text}
        </div>
      </div>
    </div>
  );
}
