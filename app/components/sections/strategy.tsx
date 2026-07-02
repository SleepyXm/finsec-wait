import { useEffect, useState,  } from "react";
import { ACCENT, gridBgStyle, Pill, sectionStyle, theme } from "../UI/UI";
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

const STRATEGY_GENERATOR_DEMO = {
  label: "Setup captured",
  box: {
    x: 24,
    y: 34,
    width: 42,
    height: 42,
  },
  output: [
    ["Direction", "Long"],
    ["Trigger", "Reclaim after RSI sweep"],
    ["Risk", "Stop: recent low"],
    ["Target", "2R"],
  ],
} as const;

type StrategyGeneratorDemo = typeof STRATEGY_GENERATOR_DEMO;

function StrategyGeneratorChart({
  demo,
  t,
}: {
  demo: StrategyGeneratorDemo;
  t: typeof theme.dark;
}) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [snapshotActive, setSnapshotActive] = useState(false);

  useEffect(() => {
    fetch("/demo-data/NQ=F-5m.json")
      .then((res) => res.json())
      .then((data: Candle[]) => {
        setCandles(data.slice(40, 450));
      });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSnapshotActive(true);
    }, 650);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gap: "1rem",
        minWidth: 0,
      }}
    >
      <div
        className="strategy-snapshot-chart"
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {candles.length > 0 ? (
            <CandleStickChart
              data={candles}
              renderTradeUI={null}
              trades={[]}
            />
          ) : (
            <p style={{ fontSize: 13, color: "rgba(238,242,247,0.5)" }}>
              Loading…
            </p>
          )}
        </div>

        <div
          className={
            snapshotActive
              ? "strategy-snapshot-dim is-active"
              : "strategy-snapshot-dim"
          }
        />

        <div
          className={
            snapshotActive
              ? "strategy-snapshot-box is-active"
              : "strategy-snapshot-box"
          }
          style={{
            left: `${demo.box.x}%`,
            top: `${demo.box.y}%`,
            width: `${demo.box.width}%`,
            height: `${demo.box.height}%`,
          }}
        >
          <div className="strategy-snapshot-corner strategy-snapshot-corner-tl" />
          <div className="strategy-snapshot-corner strategy-snapshot-corner-tr" />
          <div className="strategy-snapshot-corner strategy-snapshot-corner-bl" />
          <div className="strategy-snapshot-corner strategy-snapshot-corner-br" />

          <div className="strategy-snapshot-glow" />

          <div className="strategy-snapshot-label">
            <details open>
              <summary>{demo.label}</summary>

              <div>
                {demo.output.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
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

        e.currentTarget.style.setProperty(
          "--grid-x",
          `${e.clientX - rect.left}px`,
        );

        e.currentTarget.style.setProperty(
          "--grid-y",
          `${e.clientY - rect.top}px`,
        );
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
        background:
          "linear-gradient(180deg, rgba(14,17,23,0.98), rgba(19,24,33,0.94))",
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
            a structured strategy definition that can be applied to replay and
            backtesting.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: "1.5rem",
            ...reveal(220),
          }}
        >
          <StrategyGeneratorChart demo={STRATEGY_GENERATOR_DEMO} t={t} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "0.75rem",
            }}
          >
            {[
              ["Ticker", "Nasdaq"],
              ["Interval", "5m"],
              ["Output", "Strategy definition"],
            ].map(([label, value]) => (
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

                <div
                  style={{
                    fontSize: 12,
                    color: t.text,
                    fontWeight: 600,
                    overflowWrap: "break-word",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            style={{
              height: 44,
              width: "100%",
              border: `1px solid rgba(147, 197, 253, 0.36)`,
              background: "rgba(147, 197, 253, 0.92)",
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