import React from "react";

function WallMount({ slotAngle = 0 }: { slotAngle?: number }) {
  return (
    <div style={{ position: "relative", width: "22px", height: "22px" }}>
      {/* Cast shadow on the board */}
      <div style={{
        position: "absolute",
        inset: "-1px",
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 40%, transparent 45%, rgba(0,0,0,0.18) 100%)",
        filter: "blur(2px)",
        transform: "translateY(1px)",
      }} />
      {/* Screw body */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background: `radial-gradient(circle at 38% 32%,
          #e8e8e4 0%,
          #d0cfcb 25%,
          #b0aeaa 55%,
          #949290 75%,
          #7a7876 100%
        )`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.15)",
      }} />
      {/* Slot (shadow + highlight), rotated to slotAngle */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `rotate(${slotAngle}deg)`,
      }}>
        <div style={{ position: "relative", width: "14px", height: "3px" }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 100%)",
            borderRadius: "1px",
          }} />
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "1px",
          }} />
        </div>
      </div>
    </div>
  );
}

const CORNERS = [
  { pos: { top: "6px",    left: "6px"  }, slotAngle: 42  },
  { pos: { top: "6px",    right: "6px" }, slotAngle: 118 },
  { pos: { bottom: "6px", left: "6px"  }, slotAngle: 205 },
  { pos: { bottom: "6px", right: "6px" }, slotAngle: 73  },
];

interface PegboardProps {
  /** CSS width value, e.g. "min(900px, 90vw)" or "400px" */
  width?: string;
  /** CSS min-height value */
  minHeight?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Pegboard({
  width = "min(900px, 90vw)",
  minHeight = "min(600px, 80vh)",
  children,
  className,
  style,
}: PegboardProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width,
        minHeight,
        borderRadius: "16px",
        backgroundColor: "#f0f0ee",
        backgroundImage: `
          radial-gradient(circle at 46% 44%, rgba(110,105,100,0.9) 0%, rgba(40,38,35,0.1) 2px, transparent 3px),
          radial-gradient(circle, #0a0a09 3.5px, transparent 3.5px),
          linear-gradient(160deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 50%, rgba(220,220,218,0.2) 100%)
        `,
        backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
        border: "1px solid rgba(255,255,255,0.6)",
        ...style,
      }}
    >
      {/* Corner wall mounts */}
      {CORNERS.map(({ pos, slotAngle }, i) => (
        <div key={i} style={{ position: "absolute", ...pos }}>
          <WallMount slotAngle={slotAngle} />
        </div>
      ))}

      {children}
    </div>
  );
}
