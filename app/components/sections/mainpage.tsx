import { useEffect, useRef, useState } from "react";
import {
  ACCENT,
  DANGER,
  SUCCESS,
  Pill,
  theme,
  sectionStyle,
  gridBgStyle,
  liquidOrbStyle,
  panelStyle,
  cornerStyle,
} from "~/components/UI";
import {
  MockRuleCard,
  MockStrategyInput,
  MockTradeLog,
} from "~/components/mockinfo";

import { CandleStickChart } from "../chartrender";
import { type BacktestSession, type BacktestCandle } from "~/types/backend";
import BacktestControls from "~/backtest/components/BacktestControls";

const BEFORE_STEPS = [
  {
    label: "Watch charts manually",
    detail: "Sit in front of the screen waiting for the same setup to appear.",
  },
  {
    label: "Rewrite rules by hand",
    detail: "Move between notes, indicators, alerts, scripts, and broker windows.",
  },
  {
    label: "Execute under pressure",
    detail: "Enter late, size badly, hesitate, or miss the setup completely.",
  },
];

const AFTER_STEPS = [
  {
    label: "Define the setup once",
    detail: "FINSEC turns your rules into structured logic you can inspect.",
  },
  {
    label: "Test before deployment",
    detail: "Replay candles and backtest behaviour before risking capital.",
  },
  {
    label: "Automate execution",
    detail: "The system watches, triggers, logs, and follows the rules exactly.",
  },
];

function useReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const reveal = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  return { sectionRef, reveal };
}

export function HowItWorks() {
  const t = theme.dark;
  const { sectionRef, reveal } = useReveal();

  const steps = [
    {
      no: "01",
      title: "Write your strategy",
      copy:
        "Describe your entry and exit conditions in plain English — or import rules from TradingView's Pine Script. No coding required.",
      mock: <MockStrategyInput />,
    },
    {
      no: "02",
      title: "FINSEC translates it",
      copy:
        "Your rules get parsed into a structured logic block — visible, editable, and testable against historical data before you go live.",
      mock: <MockRuleCard />,
    },
    {
      no: "03",
      title: "It runs. You watch.",
      copy:
        "Once deployed, FINSEC monitors your instruments and executes trades automatically — logging every action in real time.",
      mock: <MockTradeLog />,
    },
  ];

  return (
    <section
      ref={sectionRef}
      style={{
        ...sectionStyle,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "6rem 2rem",
        background:
          "linear-gradient(180deg, rgba(19,24,33,0.92), rgba(14,17,23,0.98))",
      }}
    >
      <div style={gridBgStyle} />
      <div style={liquidOrbStyle("-12%", "8%", 360, 0.1)} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1080,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <Pill t={t}>From idea to execution</Pill>

          <h2
            style={{
              fontSize: 40,
              fontWeight: 600,
              color: t.text,
              letterSpacing: -1.1,
              margin: "1rem 0 0",
              ...reveal(80),
            }}
          >
            How it works
          </h2>

          <p
            style={{
              fontSize: 15,
              color: t.muted,
              margin: "0.85rem auto 0",
              lineHeight: 1.65,
              maxWidth: 590,
              ...reveal(140),
            }}
          >
            FINSEC turns your strategy into structured logic, tests it, then
            runs it in real time.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
            marginBottom: "5rem",
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.no}
              style={{
                ...panelStyle(t),
                padding: "1.35rem",
                ...reveal(220 + i * 120),
              }}
            >
              <div style={cornerStyle()} />

              <div
                style={{
                  fontSize: 11,
                  color: t.accent,
                  letterSpacing: 1,
                  marginBottom: "0.75rem",
                  fontFamily: "var(--font-code), monospace",
                }}
              >
                {step.no}
              </div>

              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: t.text,
                  margin: "0 0 0.5rem",
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  fontSize: 14,
                  color: t.muted,
                  lineHeight: 1.65,
                  margin: "0 0 1.25rem",
                }}
              >
                {step.copy}
              </p>

              {step.mock}
            </div>
          ))}
        </div>

        <div
          style={{
            ...panelStyle(t),
            padding: "1.5rem",
            ...reveal(580),
          }}
        >
          <div style={cornerStyle()} />

          <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 1.5,
                color: ACCENT,
                fontWeight: 600,
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                fontFamily: "var(--font-code), monospace",
              }}
            >
              Before and after
            </div>

            <h3
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: t.text,
                letterSpacing: -0.5,
                margin: 0,
              }}
            >
              The old way is costing you
            </h3>
          </div>

          <div
            className="comparison-head"
            style={{
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: 1.2,
                color: t.muted2,
                textTransform: "uppercase",
                paddingBottom: "0.75rem",
                borderBottom: `1px solid ${t.borderSoft}`,
                fontFamily: "var(--font-code), monospace",
              }}
            >
              Current workflow
            </div>

            <div
              style={{
                fontSize: 11,
                letterSpacing: 1.2,
                color: ACCENT,
                textTransform: "uppercase",
                paddingBottom: "0.75rem",
                borderBottom: `1px solid ${t.accentBorder}`,
                fontFamily: "var(--font-code), monospace",
              }}
            >
              With FINSEC
            </div>
          </div>

          {BEFORE_STEPS.map((before, i) => {
            const after = AFTER_STEPS[i];

            return (
              <div
                key={before.label}
                className="comparison-row"
                style={{
                  padding: "1.25rem 0",
                  borderBottom:
                    i === BEFORE_STEPS.length - 1
                      ? "none"
                      : `1px solid ${t.borderSoft}`,
                  ...reveal(660 + i * 80),
                }}
              >
                <StepText muted no={i + 1} label={before.label} detail={before.detail} />
                <StepText no={i + 1} label={after.label} detail={after.detail} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StepText({
  no,
  label,
  detail,
  muted = false,
}: {
  no: number;
  label: string;
  detail: string;
  muted?: boolean;
}) {
  const t = theme.dark;

  return (
    <div style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
      <span
        style={{
          fontSize: 11,
          color: muted ? t.hint : ACCENT,
          letterSpacing: 0.5,
          marginTop: 2,
          minWidth: 18,
          fontFamily: "var(--font-code), monospace",
        }}
      >
        {String(no).padStart(2, "0")}
      </span>

      <div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: muted ? "rgba(238,242,247,0.34)" : t.text,
            marginBottom: "0.3rem",
            textDecoration: muted ? "line-through" : "none",
            textDecorationColor: "rgba(238,242,247,0.14)",
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontSize: 13,
            color: muted ? "rgba(238,242,247,0.22)" : t.muted,
            lineHeight: 1.55,
          }}
        >
          {detail}
        </div>
      </div>
    </div>
  );
}

function ReplayEmbed({ t }: { t: typeof theme.dark }) {
  const [candles, setCandles] = useState<BacktestCandle[]>([]);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetch("/demo-data/NQ=F-5m.json")
      .then((res) => res.json())
      .then((data: BacktestCandle[]) => setCandles(data));
  }, []);

  const visibleCandles = candles.slice(0, cursor);

  const session: BacktestSession = {
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
      <div style={{ position: "relative", width: "100%", height: 250, overflow: "hidden" }}>
        {visibleCandles.length > 0 ? (
          <CandleStickChart data={visibleCandles} renderTradeUI={null} trades={[]} />
        ) : (
          <p style={{ fontSize: 13, color: "rgba(238,242,247,0.5)" }}>Loading…</p>
        )}
      </div>

      <BacktestControls
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

  return (
    <section
      ref={sectionRef}
      style={{
        ...sectionStyle,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "6rem 2rem",
        background:
          "linear-gradient(180deg, rgba(14,17,23,0.98), rgba(19,24,33,0.94))",
      }}
    >
      <div style={gridBgStyle} />
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
            Bar replay and backtesting.
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
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "0.75rem",
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

function ReplayMock() {
  const t = theme.dark;

  return (
    <div style={{ ...panelStyle(t), padding: "1.25rem" }}>
      <div style={cornerStyle()} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: t.muted2,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            fontFamily: "var(--font-code), monospace",
          }}
        >
          Bar replay
        </span>

        <div style={{ display: "flex", gap: 5 }}>
          {["⏮", "⏸", "⏭"].map((c) => (
            <button
              key={c}
              style={{
                background: "transparent",
                border: `1px solid ${t.borderSoft}`,
                color: "rgba(238,242,247,0.62)",
                padding: "4px 9px",
                cursor: "pointer",
                fontSize: 11,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          height: 104,
          display: "flex",
          gap: 4,
          alignItems: "flex-end",
          marginBottom: 14,
          paddingTop: 10,
          overflow: "hidden",
        }}
      >
        {[
          40, 55, 35, 65, 50, 70, 45, 60, 75, 55, 80, 65, 70, 85, 60, 76, 58,
          72, 88, 62,
        ].map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              background: i % 4 === 0 ? DANGER : SUCCESS,
              opacity: i < 13 ? 0.86 : 0.16,
            }}
          />
        ))}

        <div
          style={{
            position: "absolute",
            left: "64%",
            top: 0,
            bottom: 0,
            width: 1,
            background: ACCENT,
            opacity: 0.85,
          }}
        />
      </div>

      <div
        style={{
          height: 5,
          background: "rgba(238,242,247,0.06)",
          overflow: "hidden",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: "64%",
            height: "100%",
            background: ACCENT,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          fontSize: 11,
          color: t.muted2,
          fontFamily: "var(--font-code), monospace",
        }}
      >
        <span>AAPL · 1D · Jan 2023</span>
        <span style={{ color: ACCENT }}>Oct 2023</span>
      </div>
    </div>
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
            <span style={{ color: row.result.includes("+") ? SUCCESS : ACCENT }}>
              {row.result}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}