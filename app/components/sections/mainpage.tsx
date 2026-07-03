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
} from "~/components/UI/UI";
import { StepText } from "../webui";
import {
  MockRuleCard,
  MockStrategyInput,
  MockTradeLog,
  SNAPSHOT_DEMOS,
} from "~/components/mockinfo";

import { CandleStickChart } from "../chartrender";
import { type BarReplaySession, type BarReplayCandle } from "~/types/backend";
import BarReplayControls from "~/backtest/components/BarReplayControls";

const BEFORE_STEPS = [
  {
    label: "Explain the setup every time",
    detail:
      "Your strategy lives across screenshots, notes, chart memory, alerts, and repeated manual decisions.",
  },
  {
    label: "Convert ideas by hand",
    detail:
      "You turn market behaviour into indicators, alerts, scripts, or execution rules manually.",
  },
  {
    label: "Monitor and act under pressure",
    detail:
      "You wait for the setup, check conditions, decide sizing, and execute while the market is moving.",
  },
];

const AFTER_STEPS = [
  {
    label: "Capture the strategy once",
    detail:
      "FINSEC turns a strategy snapshot into structured logic that can be reviewed and adjusted.",
  },
  {
    label: "Generate the trading layer",
    detail:
      "Use the same strategy logic as an indicator, watch bot, or execution bot depending on what you need.",
  },
  {
    label: "Let the system watch",
    detail:
      "FINSEC monitors conditions, triggers actions, and logs behaviour in real time.",
  },
];

export function useReveal() {
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
      { threshold: 0.12 },
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
    title: "Capture your strategy",
    copy: "Define your setup using a strategy snapshot — entries, exits, conditions, risk rules, and the market context you care about.",
    mock: <MockStrategyInput />,
  },
  {
    no: "02",
    title: "FINSEC builds the logic",
    copy: "FINSEC turns that strategy profile into structured trading logic that can be reviewed, adjusted, and tested before deployment.",
    mock: <MockRuleCard />,
  },
  {
    no: "03",
    title: "Deploy what you need",
    copy: "Use the generated logic as an indicator, watch bot, or execution bot — with real-time monitoring and action logs.",
    mock: <MockTradeLog />,
  },
];

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
          "linear-gradient(180deg, rgba(19,24,33,0.92), rgba(14,17,23,0.98))",
      }}
    >
      <div className="grid-bg-glow" style={gridBgStyle} />
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
            FINSEC captures your strategy, validates the logic, and turns it into an automation for you to deploy.
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
                <StepText
                  muted
                  no={i + 1}
                  label={before.label}
                  detail={before.detail}
                />
                <StepText
                  no={i + 1}
                  label={after.label}
                  detail={after.detail}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}