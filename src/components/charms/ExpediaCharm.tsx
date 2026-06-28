"use client";

import { usePegboardGrid, HOLE_SIZE, SAFE_PADDING } from "@/contexts/PegboardGridContext";
import { useHint } from "@/contexts/HintContext";
import { useRef, useState, useEffect, useCallback, useId } from "react";

const HOLE_OFFSET = HOLE_SIZE / 2;
const PIVOT_X     = HOLE_OFFSET;
const PIVOT_Y     = 0;
const SPRING      = 0.018;
const DAMPING     = 0.96;

const CLICK_TEXT =
  "I was a Software Engineer at Expedia. Expedia is a global travel platform helping millions of people discover and book flights, hotels, and vacations worldwide.";

interface ExpediaCharmProps {
  col?: number;
  row?: number;
  onMove?: (col: number, row: number) => void;
  cols?: number;
  rows?: number;
  hint?: string;
}

export default function ExpediaCharm({
  col: initialCol = 0,
  row: initialRow = 0,
  onMove,
  cols = 2,
  rows = 2,
  hint,
}: ExpediaCharmProps) {
  const { innerRef, registerCharm, unregisterCharm, isAvailable } = usePegboardGrid();
  const { setHint, setClickText } = useHint();
  const id = useId();

  const width  = cols * HOLE_SIZE;
  const height = rows * HOLE_SIZE;

  const [col, setCol] = useState(initialCol);
  const [row, setRow] = useState(initialRow);
  useEffect(() => { setCol(initialCol); }, [initialCol]);
  useEffect(() => { setRow(initialRow); }, [initialRow]);

  useEffect(() => { registerCharm(id, col, row, cols, rows); }, [id, col, row, cols, rows]);
  useEffect(() => () => unregisterCharm(id), [id]);

  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [angle,   setAngle]   = useState(0);
  const [moving,  setMoving]  = useState(false);
  const [hovered, setHovered] = useState(false);

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

    const innerRectInit = inner.getBoundingClientRect();
    const clickX = e.clientX - innerRectInit.left - col * HOLE_SIZE;
    const kickDir = (clickX - PIVOT_X) >= 0 ? 1 : -1;
    velocityRef.current += kickDir * 1.5;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);

    const DRAG_THRESHOLD = 8;
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
        if (dist < DRAG_THRESHOLD) return;
        wasDragging = true;
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
        setClickText(CLICK_TEXT);
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
        background: "linear-gradient(145deg, #0054A6 0%, #003D8F 60%, #002E6E 100%)",
        border: "2px solid rgba(255,255,255,0.2)",
        boxShadow: hovered
          ? "0 4px 12px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.25), 0 0 0 3px rgba(99,155,255,0.4)"
          : "0 4px 10px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
        transition: "box-shadow 0.15s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Expedia Group "e" mark */}
        <svg viewBox="0 0 24 24" fill="none" style={{ width: "58%", height: "58%" }}>
          <path
            d="M12 3.5C7.3 3.5 3.5 7.3 3.5 12C3.5 16.7 7.3 20.5 12 20.5C14.9 20.5 17.5 19.1 19.2 16.9L16.8 15.5C15.7 17 14 17.9 12 17.9C9.4 17.9 7.2 16.2 6.4 13.9H20.3C20.4 13.3 20.5 12.7 20.5 12C20.5 7.3 16.7 3.5 12 3.5ZM6.4 11.3C7.2 9 9.4 7.3 12 7.3C14.6 7.3 16.8 9 17.6 11.3H6.4Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}
