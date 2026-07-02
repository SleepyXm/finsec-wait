import { useEffect, useRef, useState } from "react";
import { type BarReplaySession } from "~/types/backend";
import { ACCENT, theme, panelStyle, cornerStyle } from "~/components/UI/UI";

interface Props {
  session: BarReplaySession;
  cursor: number;
  setCursor: React.Dispatch<React.SetStateAction<number>>;
  totalCandles: number;
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const SPEEDS = [
  { label: "0.5x", ms: 1000 },
  { label: "1x",   ms: 500  },
  { label: "2x",   ms: 250  },
  { label: "5x",   ms: 100  },
  { label: "10x",  ms: 50   },
];

export default function BarReplayControls({
  session, cursor, setCursor, totalCandles, playing, setPlaying,
}: Props) {
  const t = theme.dark;
  const [speed, setSpeedState] = useState(500);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCursor((prev: number) => {
          if (prev >= totalCandles) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed]);

  function setSpeed(ms: number) {
    setSpeedState(ms);
  }

  const progress = totalCandles > 0 ? (cursor / totalCandles) * 100 : 0;

  return (
    <div style={{ ...panelStyle(t), padding: "1rem 1.1rem", marginTop: "1rem" }}>
      <div style={cornerStyle()} />

      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.85rem" }}>
        <button
          onClick={() => setPlaying(!playing)}
          style={{
            background: t.accent,
            color: t.btnText,
            border: "none",
            borderRadius: 0,
            padding: "0.4rem 0.95rem",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 0.4,
            fontFamily: "var(--font-code), monospace",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          {playing ? "Pause" : "Play"}
        </button>

        <button
          onClick={() => { setPlaying(false); setCursor(0); }}
          style={{
            background: "transparent",
            color: t.muted,
            border: `1px solid ${t.borderSoft}`,
            borderRadius: 0,
            padding: "0.4rem 0.85rem",
            fontSize: 12,
            fontFamily: "var(--font-code), monospace",
            letterSpacing: 0.4,
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Reset
        </button>

        <button
          onClick={() => setCursor(Math.min(cursor + 1, totalCandles))}
          disabled={playing}
          style={{
            background: "transparent",
            color: playing ? t.hint : t.muted,
            border: `1px solid ${t.borderSoft}`,
            borderRadius: 0,
            padding: "0.4rem 0.85rem",
            fontSize: 12,
            fontFamily: "var(--font-code), monospace",
            letterSpacing: 0.4,
            textTransform: "uppercase",
            cursor: playing ? "default" : "pointer",
            opacity: playing ? 0.4 : 1,
          }}
        >
          Step →
        </button>

        <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
          {SPEEDS.map((s) => {
            const active = speed === s.ms;
            return (
              <button
                key={s.label}
                onClick={() => setSpeed(s.ms)}
                style={{
                  background: active ? t.accent : "transparent",
                  color: active ? t.btnText : t.muted2,
                  border: `1px solid ${active ? "transparent" : t.borderSoft}`,
                  borderRadius: 0,
                  padding: "0.3rem 0.55rem",
                  fontSize: 11,
                  fontFamily: "var(--font-code), monospace",
                  letterSpacing: 0.3,
                  cursor: "pointer",
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ height: 5, background: "rgba(238,242,247,0.06)", overflow: "hidden" }}>
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: ACCENT,
            transition: "width 0.15s linear",
          }}
        />
      </div>

      <p
        style={{
          fontSize: 11,
          color: t.muted2,
          fontFamily: "var(--font-code), monospace",
          letterSpacing: 0.3,
          margin: "0.6rem 0 0",
        }}
      >
        Candle {cursor} / {totalCandles} — {session.ticker} {session.interval}
      </p>
    </div>
  );
}