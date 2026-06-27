import { useState, useEffect, useRef } from "react";
import { Pill, theme, FEATURES } from "~/components/UI";
import { Success } from "~/components/popup";
import { joinWaitlist, getCount } from "~/services/registration";
import { FAQS } from "~/data/FAQ";
import { AuthChartAnimation } from "~/components/UI";
import { AnimatedCount, FAQ } from "~/components/webui";
import { WaitlistForm } from "~/components/forms";

// ─── Page ────────────────────────────────────────────────────────────────────

export default function WaitlistPage() {
  const t = theme["dark"];
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState<number | null>(null);

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

  return (
    <div className="waitlist-page" style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* ── Hero: full-screen split ───────────────────────────────────────── */}
      <main className="auth-layout anim-soft-enter">

        {/* Left: animated chart */}
        <aside className="auth-visual">
          <AuthChartAnimation />
          <div className="auth-visual-copy auth-visual-copy-top anim-fade-up">
            <p>Finsec</p>
            <h1>Track your instruments, Define your strategy and</h1>
          </div>
          <div className="auth-visual-copy auth-visual-copy-bottom">
            <h1>Automate the chart out of your life.</h1>
          </div>
        </aside>

        {/* Right: waitlist panel */}
        <section className="auth-panel">
          <div className="auth-panel-inner anim-fade-up" style={{ padding: "1.75rem 2rem 2.25rem" }}>

            {/* Nav */}
            <div style={{ marginBottom: "2.5rem" }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: t.text, letterSpacing: 0.5 }}>
                FINSEC
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 32,
                fontWeight: 500,
                color: t.text,
                margin: "0 0 .75rem",
                lineHeight: 1.2,
                letterSpacing: -0.75,
              }}
            >
              You know how to trade.
              <br />
              FINSEC handles the rest.
            </h1>
            <p
              style={{
                fontSize: 15,
                color: t.muted,
                margin: "0 0 2rem",
                lineHeight: 1.65,
              }}
            >
              Most retail traders have a strategy. The problem is turning it into
              something that runs automatically — without hiring a developer or
              learning to code. FINSEC bridges that gap.
            </p>

            {/* Form or success state */}
            {submitted ? (
              <Success t={t} />
            ) : (
              <WaitlistForm t={t} onSubmit={handleSubmit} />
            )}

            {/* Stats */}
            <div
              style={{
                borderTop: `0.5px solid ${t.border}`,
                marginTop: "2.5rem",
                paddingTop: "1.5rem",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
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
                  borderLeft: `0.5px solid ${t.border}`,
                  borderRight: `0.5px solid ${t.border}`,
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 500, color: t.text }}>500</div>
                <div style={{ fontSize: 11, color: t.muted, marginTop: 3 }}>Beta seats</div>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 500, color: t.text }}>Free</div>
                <div style={{ fontSize: 11, color: t.muted, marginTop: 3 }}>During beta</div>
              </div>
            </div>

            {/* Feature pills */}
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginTop: "1.25rem",
              }}
            >
              {FEATURES.map((f) => (
                <Pill key={f} t={t}>{f}</Pill>
              ))}
            </div>

          </div>
        </section>
      </main>

      {/* ── FAQ: below the fold ──────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 460,
          margin: "0 auto",
          padding: "0 2rem 4rem",
        }}
      >
        <FAQ t={t} />
      </div>

    </div>
  );
}