import { useEffect, useRef, useState } from "react";
import {
  ACCENT,
  FEATURES,
  Pill,
  buttonStyle,
  cornerStyle,
  gridBgStyle,
  pageStyle,
  panelStyle,
  sectionStyle,
  theme,
} from "~/components/UI/UI";
import { Success } from "~/components/popup";
import { joinWaitlist, getCount } from "~/services/registration";
import { AuthChartAnimation } from "~/components/Charts";
import { AnimatedCount, FAQ } from "~/components/webui";
import { WaitlistForm } from "~/components/forms";
import { HowItWorks } from "~/components/sections/mainpage";
import { BacktestBarreplay } from "~/components/sections/backttestbarreplay";
import { StrategyGenerator } from "~/components/sections/strategy";

export default function WaitlistPage() {
  const t = theme.dark;
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const waitlistRef = useRef<HTMLDivElement>(null);

  const loadCount = async () => {
    try {
      const data = await getCount();
      setCount(data.count ?? 0);
    } catch (err) {
      console.error("Count error:", err);
    }
  };

  useEffect(() => {
    loadCount();
  }, []);

  const handleSubmit = async (data: { email: string }) => {
    await joinWaitlist(data.email);
    await loadCount();
    setSubmitted(true);
  };

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const howItWorksRef = useRef<HTMLDivElement>(null);

const scrollToHowItWorks = () => {
  howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
};

   const BarReplayRef = useRef<HTMLDivElement>(null);

const scrollToBarReplay = () => {
  BarReplayRef.current?.scrollIntoView({ behavior: "smooth" });
};


  return (
    <div className="entry-page" style={pageStyle}>
      <main className="entry-layout anim-soft-enter">
        <aside className="entry-visual">
          <AuthChartAnimation />

          <div className="entry-visual-copy entry-visual-copy-top anim-fade-up font-display">
            <p>Finsec</p>
            <h1>Define your strategy, entries, exits</h1>
          </div>

          <div className="entry-visual-copy entry-visual-copy-bottom">
            <h1>And automate the chart out of your life</h1>
          </div>
        </aside>

        <section className="auth-panel">
          <div
            className="auth-panel-inner anim-fade-up"
            style={{
              ...panelStyle(t),
              padding: "1.75rem 2rem 2.25rem",
            }}
          >
            <div style={cornerStyle()} />

            <div style={{ marginBottom: "2.5rem" }}>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: t.text,
                  letterSpacing: 0.5,
                }}
              >
                FINSEC
              </span>
            </div>

            <p
              className="hero-heading hero-heading--desktop"
              style={{
                fontSize: 34,
                fontWeight: 600,
                color: t.text,
                margin: "0 0 .75rem",
                lineHeight: 1.15,
                letterSpacing: -0.9,
              }}
            >
              You know how to trade.
              <br />
              FINSEC handles the rest.
            </p>

            <p
              className="hero-heading hero-heading--mobile"
              style={{
                fontSize: 34,
                fontWeight: 600,
                color: t.text,
                margin: "0 0 .75rem",
                lineHeight: 1.15,
                letterSpacing: -0.9,
              }}
            >
              Define your strategies, entries, exits, and automate the chart out
              of your life.
            </p>

            <p
              style={{
                fontSize: 15,
                color: t.muted,
                margin: "0 0 2rem",
                lineHeight: 1.65,
              }}
            >
              Most retail traders have a strategy. The problem is turning it
              into something that runs automatically, without hiring a developer
              or learning to code.
            </p>

            <button
              onClick={scrollToHowItWorks}
              style={{
                ...buttonStyle(t),
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: "2.5rem",
                marginLeft: "22.5%",
              }}
            >
              Find out more below ↓
            </button>

            <Stats count={count} />

            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginTop: "1.25rem",
              }}
            >
              {FEATURES.map((f) => (
                <Pill key={f} t={t}>
                  {f}
                </Pill>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div ref={howItWorksRef}>
      <HowItWorks />
      </div>

      <StrategyGenerator />
      <BacktestBarreplay />

      <section
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
          padding: "6rem 2rem",
          textAlign: "center",
          background:
            "linear-gradient(180deg, rgba(19,24,33,0.94), rgba(14,17,23,0.98))",
        }}
      >
        <div className="grid-bg-glow" style={gridBgStyle} />

        <div
          style={{
            ...panelStyle(t),
            position: "relative",
            zIndex: 1,
            maxWidth: 760,
            margin: "0 auto",
            padding: "2.5rem",
          }}
        >
          <div style={cornerStyle()} />

          <Pill t={t}>The bigger picture</Pill>

          <h2
            style={{
              fontSize: 40,
              fontWeight: 600,
              color: t.text,
              lineHeight: 1.12,
              letterSpacing: -1,
              margin: "1.25rem 0 1.5rem",
            }}
          >
            Algo trading used to require a Bloomberg terminal and a team of
            quants.
          </h2>

          <p
            style={{
              fontSize: 16,
              color: t.muted,
              lineHeight: 1.75,
              margin: "0 0 1.25rem",
            }}
          >
            FINSEC's end goal is simple: make institutional-grade trade
            automation accessible to any retail trader with a strategy.
          </p>

          <p
            style={{
              fontSize: 16,
              color: t.muted,
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            A world where your edge isn't limited by your ability to code. Where
            a well-researched strategy runs exactly as you intend it — at 3am,
            across five tickers, without you touching a button.
          </p>

          <div
            className="stat-grid"
            style={{
              gap: "1rem",
              marginTop: "3rem",
              paddingTop: "2.5rem",
              borderTop: `1px solid ${t.borderSoft}`,
            }}
          >
            {[
              { value: "0", label: "Lines of code required" },
              { value: "< 5 min", label: "From strategy to live" },
              { value: "24 / 7", label: "Runs while you sleep" },
            ].map(({ value, label }) => (
              <div
                key={label}
                style={{
                  ...panelStyle(t),
                  padding: "1rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    color: ACCENT,
                    letterSpacing: -0.5,
                    fontFamily: "var(--font-code), monospace",
                  }}
                >
                  {value}
                </div>

                <div style={{ fontSize: 12, color: t.muted, marginTop: 5 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={waitlistRef}
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
          padding: "5rem 2rem 6rem",
          background:
            "linear-gradient(180deg, rgba(14,17,23,0.98), rgba(19,24,33,0.94))",
        }}
      >
        <div className="grid-bg-glow" style={gridBgStyle} />

        <div
          style={{
            ...panelStyle(t),
            position: "relative",
            zIndex: 1,
            maxWidth: 500,
            margin: "0 auto",
            padding: "2rem",
          }}
        >
          <div style={cornerStyle()} />

          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <Pill t={t}>Limited beta · 500 seats</Pill>

            <h2
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: t.text,
                letterSpacing: -0.75,
                margin: "1rem 0 0.75rem",
                lineHeight: 1.2,
              }}
            >
              Get early access.
            </h2>

            <p
              style={{
                fontSize: 15,
                color: t.muted,
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Free during beta. No credit card. We'll reach out as seats open.
            </p>
          </div>

          {submitted ? (
            <Success t={t} />
          ) : (
            <WaitlistForm t={t} onSubmit={handleSubmit} />
          )}

          <div style={{ marginTop: "2rem" }}>
            <Stats count={count} />
          </div>
        </div>
      </section>

      <section
        style={{
          ...sectionStyle,
          padding: "4rem 2rem 5rem",
          background: t.bg,
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              ...panelStyle(t),
              padding: "1.5rem",
            }}
          >
            <div style={cornerStyle()} />
            <FAQ t={t} />
          </div>
        </div>
      </section>
    </div>
  );
}

function Stats({ count }: { count: number | null }) {
  const t = theme.dark;

  return (
    <div
      className="stat-grid"
      style={{
        ...panelStyle(t),
        padding: "1.25rem 0",
        textAlign: "center",
      }}
    >
      <div>
        <AnimatedCount value={count ?? 0} t={t} />
        <div style={{ fontSize: 11, color: t.muted, marginTop: 3 }}>
          On the waitlist
        </div>
      </div>

      <div
        style={{
          borderLeft: `1px solid ${t.borderSoft}`,
          borderRight: `1px solid ${t.borderSoft}`,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 600, color: t.text }}>500</div>
        <div style={{ fontSize: 11, color: t.muted, marginTop: 3 }}>
          Beta seats
        </div>
      </div>

      <div>
        <div style={{ fontSize: 18, fontWeight: 600, color: t.text }}>Free</div>
        <div style={{ fontSize: 11, color: t.muted, marginTop: 3 }}>
          During beta
        </div>
      </div>
    </div>
  );
}
