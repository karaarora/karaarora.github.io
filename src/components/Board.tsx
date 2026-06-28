"use client";

import { useState, useEffect } from "react";
import Pegboard from "@/components/Pegboard";
import PegboardGrid from "@/components/PegboardGrid";
import ColorCharm from "@/components/charms/ColorCharm";
import AsanaCharm from "@/components/charms/AsanaCharm";
import ExpediaCharm from "@/components/charms/ExpediaCharm";
import ResetCharm from "@/components/charms/ResetCharm";
import GlassPlate from "@/components/GlassPlate";
import LEDScreen from "@/components/LEDScreen";
import RetroMonitor from "@/components/RetroMonitor";
import PegboardButton from "@/components/PegboardButton";
import SocialCharm from "@/components/charms/SocialCharm";
import { WallColorProvider, useWallColor } from "@/contexts/WallColorContext";
import { HintProvider } from "@/contexts/HintContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const DEFAULTS = {
  wallColor:    "#c2bfba",
  colorCharm:   { col: 9,  row: 0 },
  asanaCharm:   { col: 10, row: 0 },
  expediaCharm: { col: 12, row: 0 },
  resetCharm:   { col: 11, row: 0 },
  linkedinCharm:{ col: 14, row: 8 },
  githubCharm:  { col: 16, row: 8 },
};

function BoardContent() {
  const { color, setColor } = useWallColor();

  const [resetCount,    setResetCount]    = useState(0);
  const [monitorSrc,    setMonitorSrc]    = useState<string | undefined>(undefined);
  const [colorCharmPos, setColorCharmPos] = useLocalStorage("pegboard-color-pos",   DEFAULTS.colorCharm);
  const [asanaCharmPos,   setAsanaCharmPos]   = useLocalStorage("pegboard-asana-pos",    DEFAULTS.asanaCharm);
  const [expediaCharmPos, setExpediaCharmPos] = useLocalStorage("pegboard-expedia-pos",  DEFAULTS.expediaCharm);
  const [resetCharmPos, setResetCharmPos] = useLocalStorage("pegboard-reset-pos",   DEFAULTS.resetCharm);
  const [linkedinCharmPos, setLinkedinCharmPos] = useLocalStorage("pegboard-linkedin-pos", DEFAULTS.linkedinCharm);
  const [githubCharmPos,   setGithubCharmPos]   = useLocalStorage("pegboard-github-pos",   DEFAULTS.githubCharm);

  const handleReset = () => {
    setResetCount(c => c + 1);
    setColor(DEFAULTS.wallColor);
    setColorCharmPos(DEFAULTS.colorCharm);
    setAsanaCharmPos(DEFAULTS.asanaCharm);
    setExpediaCharmPos(DEFAULTS.expediaCharm);
    setResetCharmPos(DEFAULTS.resetCharm);
    setLinkedinCharmPos(DEFAULTS.linkedinCharm);
    setGithubCharmPos(DEFAULTS.githubCharm);
  };

  return (
    <div
      className="board-outer min-h-screen flex flex-col items-center justify-start"
      style={{ background: color, gap: "2rem", padding: "2.5rem 2rem", transition: "background 0.4s ease" }}
    >
      <style>{`
        @media (max-width: 768px) {
          .board-outer {
            padding: 1rem !important;
            gap: 1rem !important;
          }
          .board-bottom-row {
            flex-direction: column !important;
          }
          .board-pegboard-scroll {
            width: 100% !important;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .board-monitor-wrap {
            flex: none !important;
            width: 100% !important;
            height: 320px;
          }
        }
      `}</style>

      {/* ── Top pegboard: name plate + utility charms ── */}
      <div className="board-pegboard-scroll" style={{ width: "100%" }}>
      <Pegboard width="100%" minHeight="120px">
        <PegboardGrid>
          <GlassPlate
            text="Hello, World!"
            col={0} row={0} cols={8} rows={2}
          />
          <ColorCharm
            col={colorCharmPos.col}
            row={colorCharmPos.row}
            cols={2}
            rows={2}
            onMove={(col, row) => setColorCharmPos({ col, row })}
            hint="Click disc to cycle wall color"
          />
          <ResetCharm
            col={resetCharmPos.col}
            row={resetCharmPos.row}
            cols={2}
            rows={2}
            onMove={(col, row) => setResetCharmPos({ col, row })}
            onReset={handleReset}
            hint="Click to reset board to defaults"
          />
        </PegboardGrid>
      </Pegboard>
      </div>

      {/* ── Bottom row: pegboard (left) + monitor (right) ── */}
      <div className="board-bottom-row" style={{ display: "flex", width: "100%", gap: "2rem", alignItems: "stretch" }}>
      <div className="board-pegboard-scroll" style={{ width: "50%", flexShrink: 0 }}>
      <Pegboard width="100%" minHeight="480px">
        <PegboardGrid>
          <AsanaCharm
            col={asanaCharmPos.col}
            row={asanaCharmPos.row}
            cols={2}
            rows={2}
            onMove={(col, row) => setAsanaCharmPos({ col, row })}
            hint="Proud Asana engineer"
          />
          <ExpediaCharm
            col={expediaCharmPos.col}
            row={expediaCharmPos.row}
            cols={2}
            rows={2}
            onMove={(col, row) => setExpediaCharmPos({ col, row })}
            hint="Previously at Expedia"
          />
          {/* ── Skill buttons ── */}
          <PegboardButton
            col={10} row={3}
            hint="React — UI framework"
            icon={
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                <ellipse cx="12" cy="12" rx="10.5" ry="3.8" stroke="#61DAFB" strokeWidth="1.4"/>
                <ellipse cx="12" cy="12" rx="10.5" ry="3.8" stroke="#61DAFB" strokeWidth="1.4" transform="rotate(60 12 12)"/>
                <ellipse cx="12" cy="12" rx="10.5" ry="3.8" stroke="#61DAFB" strokeWidth="1.4" transform="rotate(120 12 12)"/>
                <circle  cx="12" cy="12" r="1.8" fill="#61DAFB"/>
              </svg>
            }
          />
          <PegboardButton
            col={11} row={3}
            hint="Python — general purpose language"
            icon={
              <svg viewBox="0 0 48 48" width="15" height="15">
                <path fill="#3776AB" d="M24.7 1C14.3 1 15 5.7 15 5.7l0 4.4h10v1.3H10.4S3 10.6 3 21.2s6.4 10.2 6.4 10.2h3.8v-4.9s-.2-6.4 6.3-6.4h10.8s6.1.1 6.1-5.9V7C36.4 7 35.1 1 24.7 1z"/>
                <path fill="#FFD43B" d="M23.3 47c10.4 0 9.8-4.7 9.8-4.7V37.9H23v-1.3h14.7s7.3.8 7.3-10.2S38.6 16.3 38.6 16.3h-3.8v4.9s.2 6.4-6.3 6.4H17.7s-6.1-.1-6.1 5.9V40S11.6 47 23.3 47z"/>
                <circle fill="#fff" cx="19.3" cy="6.5" r="2.5"/>
                <circle fill="#fff" cx="28.7" cy="41.5" r="2.5"/>
              </svg>
            }
          />
          <PegboardButton
            col={12} row={3}
            hint="HTML — markup language"
            icon={
              /* </> — clear at any size */
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                <path d="M9 7L4 12l5 5"   stroke="#E44D26" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 7l5 5-5 5"   stroke="#E44D26" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="14.5" y1="4.5" x2="9.5" y2="19.5" stroke="#E44D26" strokeWidth="2.6" strokeLinecap="round"/>
              </svg>
            }
          />
          <PegboardButton
            col={13} row={3}
            hint="CSS — styling language"
            icon={
              /* { } — clear at any size */
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                <path d="M9 4C7 4 6.5 5 6.5 6.5V10c0 1.5-1.5 2-2.5 2 1 0 2.5.5 2.5 2v3.5C6.5 19 7 20 9 20"
                  stroke="#1572B6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 4c2 0 2.5 1 2.5 2.5V10c0 1.5 1.5 2 2.5 2-1 0-2.5.5-2.5 2v3.5C17.5 19 17 20 15 20"
                  stroke="#1572B6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <PegboardButton
            col={15} row={3}
            hint="Artificial Intelligence"
            icon={
              /* 4-pointed sparkle — modern AI symbol */
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"
                  fill="#A78BFA"/>
                <path d="M19.5 3L20.2 5.8L23 6.5L20.2 7.2L19.5 10L18.8 7.2L16 6.5L18.8 5.8L19.5 3Z"
                  fill="#C4B5FD"/>
              </svg>
            }
          />
          <PegboardButton
            col={14} row={3}
            hint="TypeScript — typed JavaScript"
            icon={
              <svg viewBox="0 0 48 48" width="14" height="14">
                <rect width="48" height="48" rx="4" fill="#3178C6"/>
                <path fill="#fff" d="M22 22h-5.5v-3H31v3h-5.5v14H22V22z"/>
                <path fill="#fff" d="M33 33.5c.8.5 2 1 3.3 1 1.4 0 2.2-.6 2.2-1.5s-.7-1.4-2.3-2c-2.3-.8-3.8-2-3.8-4 0-2.3 1.9-4 5-4 1.5 0 2.6.3 3.4.7l-.7 2.5c-.5-.3-1.5-.7-2.8-.7s-2 .6-2 1.4c0 .9.8 1.3 2.5 2 2.4.9 3.6 2.1 3.6 4.1 0 2.2-1.7 4.1-5.3 4.1-1.5 0-3-.4-3.7-.8l.6-2.8z"/>
              </svg>
            }
          />

          <LEDScreen key={resetCount}
            text="Hi, I'm Karan — nice to meet you! I'm a software engineer who obsesses over the details that make products feel great."
            col={0} row={0} cols={9} rows={6}
          />
          <SocialCharm
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#0077B5">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            }
            href="https://linkedin.com/in/karanpreetsingharora"
            label="LinkedIn"
            col={linkedinCharmPos.col}
            row={linkedinCharmPos.row}
            cols={2}
            rows={2}
            onMove={(col, row) => setLinkedinCharmPos({ col, row })}
            hint="Open LinkedIn profile"
          />
        </PegboardGrid>

      </Pegboard>
      </div>{/* end pegboard scroll wrapper */}

        {/* ── Retro monitor ── */}
        <div className="board-monitor-wrap" style={{ flex: 1, display: "flex" }}>
          <RetroMonitor src={monitorSrc} />
        </div>
      </div>{/* end bottom row */}

      {/* ── Footer ── */}
      <div style={{
        textAlign: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 11,
        letterSpacing: "0.04em",
        color: "rgba(0,0,0,0.38)",
        userSelect: "none",
        paddingBottom: "0.5rem",
      }}>
        Built by Karan, also known as Karanpreet Singh Arora &copy; 2026
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div style={{
      minHeight: "100vh", background: "#c2bfba",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        border: "3px solid rgba(0,0,0,0.1)",
        borderTopColor: "rgba(0,0,0,0.35)",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function Board() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <Loader />;

  return (
    <WallColorProvider defaultColor={DEFAULTS.wallColor}>
      <HintProvider>
        <BoardContent />
      </HintProvider>
    </WallColorProvider>
  );
}
