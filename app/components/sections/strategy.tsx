import { useEffect, useRef, useState } from "react";
import {
  ACCENT,
  cornerStyle,
  gridBgStyle,
  panelStyle,
  Pill,
  sectionStyle,
  theme,
} from "../UI/UI";
import type { UTCTimestamp } from "lightweight-charts";
import { CandleStickChart } from "../chartrender";
import { useReveal } from "./mainpage";

type Candle = {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
};

type AnimPhase = 0 | 1 | 2 | 3;

const SETUP_OUTPUT: [string, string][] = [
  ["Direction", "Short"],
  ["Trigger",   "Forming Head and Shoulders"],
  ["Risk",      "Stop: Previous Bullish OB"],
  ["Target",    "3RR"],
];

const PINESCRIPT = `//@version=5
strategy("RSI Reclaim – Long", overlay=true,
         default_qty_type=strategy.percent_of_equity,
         default_qty_value=2)

// ── Inputs ────────────────────────────────────────
rsiLen = input.int(14,    "RSI Length")
rsiOS  = input.float(30,  "Oversold level")
rrR    = input.float(2.0, "R:R target")

// ── Core logic ────────────────────────────────────
rsi       = ta.rsi(close, rsiLen)
sweptOS   = ta.lowest(rsi, 3) < rsiOS
reclaimed = rsi > rsiOS and rsi[1] <= rsiOS
entry     = sweptOS[1] and reclaimed

// ── Risk management ───────────────────────────────
recentLow = ta.lowest(low, 5)
stopDist  = close - recentLow
target    = close + stopDist * rrR

if entry
    strategy.entry("Long", strategy.long)
    strategy.exit("TP/SL", "Long",
                  stop  = recentLow,
                  limit = target)

// ── Visuals ───────────────────────────────────────
plotshape(entry,
          style    = shape.triangleup,
          location = location.belowbar,
          color    = color.new(color.lime, 0),
          size     = size.small)`;

function StrategyGeneratorChart({ t }: { t: typeof theme.dark }) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [phase, setPhase]     = useState<AnimPhase>(0);
  const [codeOpen, setCodeOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

 useEffect(() => {

  fetch("/demo-data/NQ=F-5m.json")

    .then((r) => r.json())

    .then((data: Candle[]) => {

      const isMobile = window.innerWidth < 768;

      setCandles(

        isMobile

          ? data.slice(375, 425)

          : data.slice(40, 450)

      );

    });

}, []);

  const runSequence = () => {
    timers.current.forEach(clearTimeout);
    setPhase(0);
    setCodeOpen(false);
    timers.current = [
      window.setTimeout(() => setPhase(1), 300),   // box starts expanding
      window.setTimeout(() => setPhase(2), 1500),  // box done → dim + text
      window.setTimeout(() => setPhase(3), 2300),  // pinescript panel
    ];
  };

  useEffect(() => {
    if (candles.length === 0) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runSequence();
        } else {
          timers.current.forEach(clearTimeout);
          setPhase(0);
          setCodeOpen(false);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [candles.length]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <div ref={containerRef} style={{ display: "grid", gap: "0.75rem", minWidth: 0 }}>

      {/* ── Chart ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 460,
          overflow: "hidden",
          background: "rgba(3,7,18,0.18)",
          borderTop: `1px solid ${t.borderSoft}`,
          borderBottom: `1px solid ${t.borderSoft}`,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          {candles.length > 0 ? (
            <CandleStickChart data={candles} renderTradeUI={null} trades={[]} />
          ) : (
            <p style={{ fontSize: 13, color: t.muted, padding: "1rem" }}>Loading…</p>
          )}
        </div>

        {/* Phase 2: dim everything to the right of the capture box, above time axis */}
        <div
  className={[
    "strategy-capture-box",
    phase >= 1 ? "is-active" : "",
    phase >= 2 ? "is-dimmed" : "",
  ].join(" ")}
/>

        {/* Phase 1: capture box — full height minus time axis, width expands */}
        <div className={`strategy-capture-box${phase >= 1 ? " is-active" : ""}`}>
          {/* cornerStyle() from UI handles the four corner accents */}
          <div style={cornerStyle()} />

          {/* Phase 2: setup output overlaid inside the captured region */}
          <div className={`strategy-capture-output${phase >= 2 ? " is-active" : ""}`}>
            <div
              style={{
                fontSize: 9,
                fontFamily: "var(--font-code), monospace",
                textTransform: "uppercase",
                letterSpacing: "0.9px",
                color: t.muted2,
                marginBottom: "0.5rem",
              }}
            >
              Setup captured
            </div>

            <div style={{ display: "grid", gap: "0.3rem" }}>
              {SETUP_OUTPUT.map(([label, value]) => (
                <div key={label} style={{ display: "flex", gap: "1rem", fontSize: 12 }}>
                  <span
                    style={{
                      color: t.muted2,
                      fontFamily: "var(--font-code), monospace",
                      minWidth: 50,
                    }}
                  >
                    {label}
                  </span>
                  <span style={{ color: t.text, fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── PineScript panel — outside pointer-events:none chart div ── */}
      <div
        className={`strategy-pine-panel${phase >= 3 ? " is-active" : ""}`}
        style={{ ...panelStyle(t), padding: "0.4rem 0.75rem" }}
      >
        <button
          type="button"
          className="strategy-code-toggle"
          onClick={() => setCodeOpen((o) => !o)}
        >
          <span>PineScript output</span>
          <span className={`strategy-code-chevron${codeOpen ? " open" : ""}`}>▾</span>
        </button>

        {codeOpen && (
          <div className="strategy-code-block">
            <pre><code>{PINESCRIPT}</code></pre>
          </div>
        )}
      </div>
    </div>
  );
}

export function StrategyGenerator() {
  const t = theme.dark;
  const { sectionRef, reveal } = useReveal();

  return (
    <section
      ref={sectionRef}
      className="grid-glow-section"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--grid-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--grid-y", `${e.clientY - rect.top}px`);
      }}
      style={{
        ...sectionStyle,
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        padding: "6rem 2rem",
        background: "linear-gradient(180deg, rgba(14,17,23,0.98), rgba(19,24,33,0.94))",
      }}
    >
      <div className="grid-bg-glow" style={gridBgStyle} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1120,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <Pill t={t}>Strategy generator</Pill>

          <h2
            style={{
              fontSize: 42,
              fontWeight: 600,
              color: t.text,
              margin: "1rem auto 0",
              lineHeight: 1.08,
              letterSpacing: -1.15,
              maxWidth: 760,
              ...reveal(80),
            }}
          >
            Turn a setup into a strategy.
            <br />
            <span style={{ color: ACCENT }}>Then test it on history.</span>
          </h2>

          <p
            style={{
              fontSize: 15,
              color: t.muted,
              lineHeight: 1.72,
              margin: "1.15rem auto 0",
              maxWidth: 680,
              ...reveal(140),
            }}
          >
            Capture chart context or describe the setup. FINSEC converts it into
            a structured strategy definition that can be applied to replay and backtesting.
          </p>
        </div>

        <div style={{ display: "grid", gap: "1.5rem", ...reveal(220) }}>
          <StrategyGeneratorChart t={t} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "0.75rem",
            }}
          >
            {([["Ticker", "Nasdaq"], ["Interval", "5m"], ["Output", "Strategy definition"]] as const).map(
              ([label, value]) => (
                <div
                  key={label}
                  style={{
                    borderTop: `1px solid ${t.borderSoft}`,
                    paddingTop: "0.8rem",
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: t.muted2,
                      fontFamily: "var(--font-code), monospace",
                      marginBottom: 4,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: 12, color: t.text, fontWeight: 600, overflowWrap: "break-word" }}>
                    {value}
                  </div>
                </div>
              )
            )}
          </div>

          <button
            type="button"
            style={{
              height: 44,
              width: "100%",
              border: `1px solid ${t.accentBorder}`,
              background: t.accent,
              color: "#0e1117",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Test it out →
          </button>
        </div>
      </div>
    </section>
  );
}