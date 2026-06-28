"use client";

import { usePegboardGrid, HOLE_SIZE, SAFE_PADDING } from "@/contexts/PegboardGridContext";
import { useHint } from "@/contexts/HintContext";
import { useRef, useState, useEffect, useCallback, useId, ReactNode } from "react";

const HOLE_OFFSET = HOLE_SIZE / 2;
const PIVOT_X     = HOLE_OFFSET;
const PIVOT_Y     = 0;
const SPRING      = 0.018;
const DAMPING     = 0.96;

interface SocialCharmProps {
  icon: ReactNode;
  href: string;
  label: string;
  col?: number;
  row?: number;
  onMove?: (col: number, row: number) => void;
  cols?: number;
  rows?: number;
  hint?: string;
  /** If provided, called on click instead of opening href in a new tab */
  onClick?: () => void;
}

export default function SocialCharm({
  icon,
  href,
  label,
  col: initialCol = 0,
  row: initialRow = 0,
  onMove,
  cols = 2,
  rows = 2,
  hint,
  onClick,
}: SocialCharmProps) {
  const { innerRef, registerCharm, unregisterCharm, isAvailable } = usePegboardGrid();
  const { setHint } = useHint();
  const id = useId();

  const width  = cols * HOLE_SIZE;
  const height = rows * HOLE_SIZE;

  const [col, setCol] = useState(initialCol);
  const [row, setRow] = useState(initialRow);
  useEffect(() => { setCol(initialCol); }, [initialCol]);
  useEffect(() => { setRow(initialRow); }, [initialRow]);

  useEffect(() => { registerCharm(id, col, row, cols, rows); }, [id, col, row, cols, rows]);
  useEffect(() => () => unregisterCharm(id), [id]);

  const [dragPos, setDragPos]   = useState<{ x: number; y: number } | null>(null);
  const [angle,   setAngle]     = useState(0);
  const [moving,  setMoving]    = useState(false);
  const [hovered, setHovered]   = useState(false);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const inner = innerRef.current;
    if (!inner) return;

    didDrag.current = false;

    // Sway kick on click
    const innerRectInit = inner.getBoundingClientRect();
    const clickX = e.clientX - innerRectInit.left - col * HOLE_SIZE;
    const kickDir = (clickX - PIVOT_X) >= 0 ? 1 : -1;
    velocityRef.current += kickDir * 1.5;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);

    const DRAG_THRESHOLD = 8;
    let wasDragging   = false;
    let finalCol      = col;
    let finalRow      = row;
    let lastX         = e.clientX;
    const startCol    = col;
    const startRow    = row;
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;

    const onMouseMove = (ev: MouseEvent) => {
      const dist = Math.hypot(ev.clientX - startMouseX, ev.clientY - startMouseY);
      if (!wasDragging) {
        if (dist < DRAG_THRESHOLD) return;
        wasDragging = true;
        didDrag.current = true;
        setMoving(true);
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      }

      const innerRect = inner.getBoundingClientRect();
      const outerRect = (inner.parentElement ?? inner).getBoundingClientRect();

      const x = ev.clientX - innerRect.left - HOLE_OFFSET;
      const y = ev.clientY - innerRect.top;
      setDragPos({ x, y });

      const maxCol = Math.max(0, Math.floor((outerRect.width  - SAFE_PADDING.left - HOLE_OFFSET) / HOLE_SIZE));
      const maxRow = Math.max(0, Math.floor((outerRect.height - SAFE_PADDING.top)               / HOLE_SIZE));
      finalCol = Math.max(0, Math.min(maxCol, Math.round(x / HOLE_SIZE)));
      finalRow = Math.max(0, Math.min(maxRow, Math.round(y / HOLE_SIZE)));

      const dx = ev.clientX - lastX;
      lastX = ev.clientX;
      velocityRef.current = velocityRef.current * 0.6 + (dx * 2.5 - angleRef.current) * 0.25;
      angleRef.current   += velocityRef.current;
      setAngle(angleRef.current);
    };

    const onMouseUp = () => {
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
      } else {
        // Plain click → custom handler or open link
        if (onClick) {
          onClick();
        } else {
          window.open(href, "_blank", "noopener,noreferrer");
        }
      }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
  };

  const discSize = 48;
  const discTop  = height - discSize - 4;

  return (
    <div
      onMouseEnter={() => { setHovered(true); if (hint) setHint(hint); }}
      onMouseLeave={() => { setHovered(false); setHint(""); }}
      onMouseDown={handleMouseDown}
      title={label}
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
      {/* Hook */}
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

      {/* Disc */}
      <div style={{
        position: "absolute",
        top: discTop, left: HOLE_OFFSET,
        transform: "translateX(-50%)",
        width: discSize, height: discSize,
        borderRadius: "50%",
        background: "linear-gradient(145deg, #ffffff 0%, #f5f4f2 60%, #e8e6e2 100%)",
        border: "2px solid rgba(255,255,255,0.6)",
        boxShadow: hovered
          ? "0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 3px rgba(99,155,255,0.4)"
          : "0 4px 10px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
        transition: "box-shadow 0.15s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {icon}
      </div>
    </div>
  );
}
