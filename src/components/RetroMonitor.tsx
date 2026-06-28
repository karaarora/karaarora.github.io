"use client";

import { ReactNode } from "react";

interface RetroMonitorProps {
  content?: ReactNode;
}

export default function RetroMonitor({ content }: RetroMonitorProps) {
  return (
    /* Outer wrapper fills the height given by the flex row */
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>

      {/* ── Monitor body — stretches to full height ── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        borderRadius: 20,
        background: "linear-gradient(155deg, #ddd4c2 0%, #c9bfae 45%, #b8ad9c 100%)",
        padding: "18px 18px 48px 18px",
        position: "relative",
        boxShadow: `
          inset 0 3px 5px rgba(255,255,255,0.6),
          inset 0 -3px 5px rgba(0,0,0,0.15),
          inset 3px 0 5px rgba(255,255,255,0.3),
          inset -3px 0 5px rgba(0,0,0,0.1),
          0 24px 64px rgba(0,0,0,0.45),
          0  8px 24px rgba(0,0,0,0.25)
        `,
      }}>

        {/* ── Screen bezel — fills remaining space ── */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#18160f",
          borderRadius: 8,
          padding: 10,
          boxShadow: "inset 0 6px 24px rgba(0,0,0,0.9), inset 0 0 60px rgba(0,0,0,0.7)",
        }}>

          {/* ── Screen — fills bezel ── */}
          <div style={{
            flex: 1,
            position: "relative",
            borderRadius: 4,
            overflow: "hidden",
            background: "#060a07",
          }}>
            {/* Scan lines */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
              background: "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.13) 3px, rgba(0,0,0,0.13) 4px)",
            }} />
            {/* Glass reflection */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "35%", zIndex: 4, pointerEvents: "none",
              background: "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, transparent 100%)",
              borderRadius: "4px 4px 50% 50% / 4px 4px 20px 20px",
            }} />
            {/* Vignette */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
              background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)",
            }} />

            {/* Content */}
            <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
              {content ? (
                <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
                  {content}
                </div>
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: 14,
                }}>
                  {/* cute cat */}
                  <pre style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: "#3dff7a",
                    textShadow: "0 0 6px rgba(61,255,122,0.7)",
                    opacity: 0.8,
                    margin: 0,
                    userSelect: "none",
                    textAlign: "left",
                  }}>{` ╱|、\n(˚ˎ 。7\n|、˜〵\nじしˍ,)ノ`}</pre>

                  <div style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.25em",
                    color: "#3dff7a",
                    textShadow: "0 0 8px #3dff7a, 0 0 20px rgba(61,255,122,0.4)",
                  }}>
                    NO SIGNAL
                  </div>
                  <div style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: 9,
                    letterSpacing: "0.15em",
                    color: "rgba(61,255,122,0.45)",
                  }}>
                    PROJECTS LOADING...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom strip ── */}
        <div style={{
          position: "absolute",
          bottom: 13, left: 18, right: 18,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#00ff55",
            boxShadow: "0 0 5px #00ff55, 0 0 10px rgba(0,255,85,0.5)",
            flexShrink: 0,
          }} />
          <div style={{
            width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
            background: "radial-gradient(circle at 38% 35%, #c4bab0, #8a8070)",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.45), 0 1px 2px rgba(255,255,255,0.2)",
          }} />
          <div style={{
            flex: 1, textAlign: "center",
            fontFamily: "'Courier New', monospace",
            fontSize: 9, fontWeight: 700,
            letterSpacing: "0.22em",
            color: "#8a806e",
            textTransform: "uppercase",
            userSelect: "none",
          }}>
            KR-9000
          </div>
          {[0, 1].map(i => (
            <div key={i} style={{
              width: 15, height: 15, borderRadius: "50%", flexShrink: 0,
              background: "radial-gradient(circle at 38% 32%, #d4cabb, #8a8070)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.3)",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
