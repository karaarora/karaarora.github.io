"use client";

import React, { useEffect, useId, useState } from "react";
import { usePegboardGrid, HOLE_SIZE } from "@/contexts/PegboardGridContext";
import { useHint } from "@/contexts/HintContext";
import Screw from "@/components/Screw";

interface LEDScreenProps {
  text?: string;
  col?: number;
  row?: number;
  cols?: number;
  rows?: number;
}

export default function LEDScreen({
  text = "TEXT",
  col  = 0,
  row  = 0,
  cols = 9,
  rows = 6,
}: LEDScreenProps) {
  const { registerCharm, unregisterCharm } = usePegboardGrid();
  const { hint, clickText, setClickText } = useHint();
  const id = useId();

  const width  = cols * HOLE_SIZE;
  const height = rows * HOLE_SIZE;

  useEffect(() => { registerCharm(id, col, row, cols, rows); }, [id, col, row, cols, rows]);
  useEffect(() => () => unregisterCharm(id), [id]);

  // Default typing effect
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (displayed.length >= text.length) return;
    const t = setTimeout(
      () => setDisplayed(text.slice(0, displayed.length + 1)),
      displayed.length === 0 ? 600 : 65,
    );
    return () => clearTimeout(t);
  }, [displayed, text]);

  // Click-triggered typing effect
  const [clickDisplayed, setClickDisplayed] = useState("");

  // When clickText is set, reset the click display so it re-types from scratch
  useEffect(() => {
    if (clickText) setClickDisplayed("");
  }, [clickText]);

  // Type out the click text char by char
  useEffect(() => {
    if (!clickText) return;
    if (clickDisplayed.length >= clickText.length) {
      // Done typing — wait 4 s then clear
      const t = setTimeout(() => setClickText(""), 4000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setClickDisplayed(clickText.slice(0, clickDisplayed.length + 1)),
      clickDisplayed.length === 0 ? 300 : 55,
    );
    return () => clearTimeout(t);
  }, [clickText, clickDisplayed, setClickText]);

  return (
    <div style={{
      position: "absolute",
      left: col * HOLE_SIZE,
      top:  row  * HOLE_SIZE,
      width,
      height,
      borderRadius: 16,

      // ── Liquid glass shell ────────────────────────────────────────────
      background: `linear-gradient(
        135deg,
        rgba(255,255,255,0.14) 0%,
        rgba(255,255,255,0.04) 40%,
        rgba(255,255,255,0.08) 100%
      )`,
      backdropFilter:       "blur(6px) saturate(140%) brightness(1.03)",
      WebkitBackdropFilter: "blur(6px) saturate(140%) brightness(1.03)",
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

      {/* Top specular sheen — kept subtle so holes stay visible */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "48%",
        borderRadius: "16px 16px 60% 60% / 16px 16px 28px 28px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 100%)",
        pointerEvents: "none",
      }} />
      {/* Inner depth ring */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 16,
        boxShadow: "inset 0 -6px 16px rgba(0,0,0,0.05), inset 0 6px 16px rgba(255,255,255,0.12)",
        pointerEvents: "none",
      }} />

      {/* Corner screws */}
      <Screw corner="tl" />
      <Screw corner="tr" />
      <Screw corner="bl" />
      <Screw corner="br" />

      {/* ── LCD module, inset inside the glass ── */}
      <div style={{
        position: "absolute",
        top: 28, left: 24, right: 24, bottom: 24,
        background: "linear-gradient(160deg, #2a2a2a 0%, #191919 100%)",
        borderRadius: 6,
        border: "1px solid #3a3a3a",
        boxShadow: "0 4px 14px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        padding: "8px 10px 8px 10px",
        gap: 6,
        boxSizing: "border-box",
      }}>

        {/* Screen */}
        <div style={{
          flex: 1,
          background: "#0c2410",
          borderRadius: 3,
          border: "1.5px solid #080808",
          boxShadow: "inset 0 2px 10px rgba(0,0,0,0.95), 0 0 10px rgba(0,210,60,0.07)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: "8px 10px",
        }}>
          {/* Scan lines */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            background: "repeating-linear-gradient(180deg, transparent 0px, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 3px)",
          }} />
          {/* Backlight bleed */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
            background: "radial-gradient(ellipse 80% 60% at 40% 50%, rgba(0,255,70,0.05) 0%, transparent 100%)",
          }} />

          {/* Typed text + inline cursor — priority: clickText > hint > default */}
          <div style={{ position: "relative", zIndex: 3, lineHeight: 1.7 }}>
            {clickText ? (
              /* Click mode — green typing of Asana message */
              <>
                <span style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#3dff7a",
                  textShadow: "0 0 5px #3dff7a, 0 0 14px rgba(61,255,122,0.4)",
                  letterSpacing: "0.12em",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>
                  {clickDisplayed}
                </span>
                <span style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#3dff7a",
                  textShadow: "0 0 5px #3dff7a",
                  animation: "ledCursorBlink 1.1s step-end infinite",
                  display: "inline-block",
                }}>▌</span>
              </>
            ) : hint ? (
              /* Hover hint mode — amber prompt line */
              <>
                <span style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#ffcc44",
                  textShadow: "0 0 6px #ffcc44, 0 0 14px rgba(255,204,68,0.4)",
                  letterSpacing: "0.1em",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>
                  {"› " + hint}
                </span>
                <span style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#ffcc44",
                  textShadow: "0 0 5px #ffcc44",
                  animation: "ledCursorBlink 1.1s step-end infinite",
                  display: "inline-block",
                }}>▌</span>
              </>
            ) : (
              /* Default typing mode */
              <>
                <span style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#3dff7a",
                  textShadow: "0 0 5px #3dff7a, 0 0 14px rgba(61,255,122,0.4)",
                  letterSpacing: "0.12em",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>
                  {displayed}
                </span>
                <span style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#3dff7a",
                  textShadow: "0 0 5px #3dff7a",
                  animation: "ledCursorBlink 1.1s step-end infinite",
                  display: "inline-block",
                }}>▌</span>
              </>
            )}
          </div>
          <style>{`@keyframes ledCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
        </div>

        {/* Status strip */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "#00ff55",
            boxShadow: "0 0 4px #00ff55, 0 0 8px rgba(0,255,85,0.7)",
          }} />
          <div style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "#ff9500",
            boxShadow: "0 0 3px rgba(255,149,0,0.5)",
            opacity: 0.55,
          }} />
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 7,
            color: "#555",
            letterSpacing: "0.06em",
            marginLeft: "auto",
            userSelect: "none",
          }}>
            LCD 16×2
          </span>
        </div>
      </div>
    </div>
  );
}
