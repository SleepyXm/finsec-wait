import { useEffect, useState } from "react";
import BarReplayControls from "~/backtest/components/BarReplayControls";
import type { BarReplayCandle, BarReplaySession } from "~/types/backend";
import { CandleStickChart } from "../chartrender";
import { theme, panelStyle, sectionStyle, gridBgStyle, liquidOrbStyle, Pill, cornerStyle, SUCCESS, DANGER, ACCENT } from "../UI/UI";
import { useReveal } from "./mainpage";
import { SNAPSHOT_DEMOS } from "../mockinfo";


function ReplayEmbed({ t }: { t: typeof theme.dark }) {
  const [candles, setCandles] = useState<BarReplayCandle[]>([]);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetch("/demo-data/NQ=F-5m.json")
      .then((res) => res.json())
      .then((data: BarReplayCandle[]) => {
        setCandles(data);
        setCursor(Math.min(60, data.length));
      });
  }, []);

  const visibleCandles = candles.slice(0, cursor);

  const session: BarReplaySession = {
    session_id: "demo",
    ticker: "Nasdaq",
    interval: "5m",
    date_from: "",
    date_to: "",
    starting_balance: 0,
    candle_count: candles.length,
    created_at: new Date().toISOString(),
  };

  return (
    <div style={{ ...panelStyle(t), padding: "1rem" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          maxHeight: 320,
          overflow: "hidden",
        }}
      >
        {visibleCandles.length > 0 ? (
          <CandleStickChart
            data={visibleCandles}
            renderTradeUI={null}
            trades={[]}
          />
        ) : (
          <p style={{ fontSize: 13, color: "rgba(238,242,247,0.5)" }}>
            Loading…
          </p>
        )}
      </div>

      <BarReplayControls
        session={session}
        cursor={cursor}
        setCursor={setCursor}
        totalCandles={candles.length}
        playing={playing}
        setPlaying={setPlaying}
      />
    </div>
  );
}

export function BacktestBarreplay() {
  const t = theme.dark;
  const { sectionRef, reveal } = useReveal();

  const features = [
    {
      label: "Replay historical candles",
      detail:
        "Step through past market sessions bar by bar and practise reading structure before the outcome is visible.",
    },
    {
      label: "Backtest your actual rules",
      detail:
        "Run entry, exit, stop-loss, and take-profit logic against historical data before trusting it with capital.",
    },
    {
      label: "Review every trade",
      detail:
        "See wins, losses, drawdowns, skipped setups, and execution logs in one place.",
    },
    {
      label: "No premium lock",
      detail:
        "Replay and backtesting are part of the core workflow. Testing should not be an upgrade.",
    },
  ];

  const included = [
    "Bar replay",
    "Historical backtesting",
    "Strategy metrics",
    "Trade-by-trade logs",
    "Drawdown visibility",
    "Rule editing before live deployment",
  ];

  const [snapshotIndex, setSnapshotIndex] = useState(0);

useEffect(() => {
  const timer = window.setInterval(() => {
    setSnapshotIndex((current) => (current + 1) % SNAPSHOT_DEMOS.length);
  }, 5200);

  return () => window.clearInterval(timer);
}, []);

const snapshot = SNAPSHOT_DEMOS[snapshotIndex];

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
      <div style={liquidOrbStyle("4%", "70%", 430, 0.08)} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1120,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <Pill t={t}>No hidden paywalls</Pill>

          <h2
            style={{
              fontSize: 42,
              fontWeight: 600,
              color: t.text,
              margin: "1rem auto 0",
              lineHeight: 1.08,
              letterSpacing: -1.15,
              maxWidth: 740,
              ...reveal(80),
            }}
          >
            Bar replay and Backtesting combined.
            <br />
            <span style={{ color: ACCENT }}>Both free.</span>
          </h2>

          <p
            style={{
              fontSize: 15,
              color: t.muted,
              lineHeight: 1.72,
              margin: "1.15rem auto 0",
              maxWidth: 660,
              ...reveal(140),
            }}
          >
            Replay the market, test your rules, and understand the result before
            going live.
          </p>
        </div>

        <div className="split-grid" style={{ marginBottom: "4.5rem" }}>
          <div style={reveal(220)}>
            <div
              style={{
                ...panelStyle(t),
                padding: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              <div style={cornerStyle()} />

              <p
                style={{
                  fontSize: 15,
                  color: t.muted,
                  lineHeight: 1.72,
                  margin: "0 0 1.1rem",
                }}
              >
                Bar replay lets you step through historical candles one at a
                time, without seeing the future.
              </p>

              <p
                style={{
                  fontSize: 15,
                  color: t.muted,
                  lineHeight: 1.72,
                  margin: 0,
                }}
              >
                Backtesting runs your rules across historical price data,
                showing performance, drawdown, trade count, and where the
                strategy failed.
              </p>
            </div>

            <div
              className="included-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "0.75rem",
                width: "100%",
                minWidth: 0,
                marginBottom: "1rem",
              }}
            >
              {included.map((item) => (
                <div
                  key={item}
                  style={{
                    ...panelStyle(t),
                    display: "flex",
                    gap: "0.6rem",
                    alignItems: "center",
                    padding: "0.8rem 0.9rem",
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 99,
                      background: t.accent,
                      flexShrink: 0,
                    }}
                  />

                  <span
                    style={{
                      fontSize: 13,
                      color: "rgba(238,242,247,0.72)",
                      lineHeight: 1.4,
                      minWidth: 0,
                      overflowWrap: "break-word",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              minWidth: 0,
              ...reveal(300),
            }}
          >
            <ReplayEmbed t={t} />
            <BacktestMock />
          </div>
        </div>

        <div className="feature-grid">
          {features.map((feature, i) => (
            <div
              key={feature.label}
              style={{
                ...panelStyle(t),
                padding: "1.25rem",
                ...reveal(420 + i * 90),
              }}
            >
              <div style={cornerStyle()} />

              <div
                style={{
                  fontSize: 11,
                  color: ACCENT,
                  letterSpacing: 1,
                  marginBottom: "0.8rem",
                  fontFamily: "var(--font-code), monospace",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: t.text,
                  margin: "0 0 0.55rem",
                }}
              >
                {feature.label}
              </h3>

              <p
                style={{
                  fontSize: 13,
                  color: t.muted,
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {feature.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BacktestMock() {
  const t = theme.dark;

  const metrics = [
    { label: "Win rate", value: "61.4%", color: SUCCESS },
    { label: "Avg return", value: "+3.2%", color: SUCCESS },
    { label: "Max drawdown", value: "−8.1%", color: DANGER },
    { label: "Total trades", value: "142", color: t.text },
    { label: "Sharpe ratio", value: "1.84", color: t.text },
    { label: "Period", value: "2y", color: t.muted },
  ];

  const rows = [
    { time: "09:45", action: "Long entry", result: "+1.8%" },
    { time: "11:20", action: "Stop avoided", result: "Rule held" },
    { time: "14:05", action: "Exit signal", result: "+3.4%" },
  ];

  return (
    <div style={{ ...panelStyle(t), padding: "1.25rem" }}>
      <div style={cornerStyle()} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: t.muted2,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            fontFamily: "var(--font-code), monospace",
          }}
        >
          Backtest results · RSI + MA strategy
        </div>

        <Pill t={t}>Free</Pill>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.9rem",
          marginBottom: "1.25rem",
        }}
      >
        {metrics.map(({ label, value, color }) => (
          <div key={label}>
            <div
              style={{
                fontSize: 10,
                color: t.muted2,
                marginBottom: 3,
                fontFamily: "var(--font-code), monospace",
              }}
            >
              {label}
            </div>

            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color,
                fontFamily: "var(--font-code), monospace",
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.55rem",
          paddingTop: "1rem",
          borderTop: `1px solid ${t.borderSoft}`,
          fontFamily: "var(--font-code), monospace",
        }}
      >
        {rows.map((row) => (
          <div
            key={`${row.time}-${row.action}`}
            style={{
              display: "grid",
              gridTemplateColumns: "48px 1fr auto",
              gap: "0.75rem",
              alignItems: "center",
              fontSize: 11,
            }}
          >
            <span style={{ color: t.muted2 }}>{row.time}</span>
            <span style={{ color: t.muted }}>{row.action}</span>
            <span
              style={{ color: row.result.includes("+") ? SUCCESS : ACCENT }}
            >
              {row.result}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}