import { useState, useEffect, useRef } from "react";
import { Pill, Label, theme, FEATURES } from "~/components/UI";
import { Success } from "~/components/popup";
import { joinWaitlist, getCount } from "~/services/registration";
import { FAQS } from "~/data/FAQ";
import { AuthChartAnimation } from "~/components/UI";

// ─── FAQ ────────────────────────────────────────────────────────────────────

function FAQ({ t }: { t: any }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ marginTop: "3rem" }}>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: t.text,
          margin: "0 0 1rem",
        }}
      >
        Common questions
      </h2>
      {FAQS.map((faq, i) => (
        <div
          key={i}
          style={{ borderTop: `0.5px solid ${t.border}`, padding: "14px 0" }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 0,
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: 500,
              color: t.text,
              textAlign: "left",
            }}
          >
            <span>{faq.q}</span>
            <span
              style={{
                color: t.muted,
                fontSize: 20,
                lineHeight: 1,
                marginLeft: 12,
                flexShrink: 0,
              }}
            >
              {open === i ? "−" : "+"}
            </span>
          </button>
          {open === i && (
            <p
              style={{
                fontSize: 14,
                color: t.muted,
                margin: "10px 0 0",
                lineHeight: 1.65,
              }}
            >
              {faq.a}
            </p>
          )}
        </div>
      ))}
      <div style={{ borderTop: `0.5px solid ${t.border}` }} />
    </div>
  );
}

// ─── Digit reel ─────────────────────────────────────────────────────────────

function DigitReel({ digit }: { digit: number }) {
  const height = 24;
  const [items, setItems] = useState([0]);
  const [offset, setOffset] = useState(0);
  const lastDigit = useRef(0);

  useEffect(() => {
    const from = lastDigit.current;
    const to = digit;

    if (from === to) {
      setItems([to]);
      setOffset(0);
      return;
    }

    const sequence: number[] = [];
    let current = from;
    sequence.push(current);
    while (current !== to) {
      current = (current + 1) % 10;
      sequence.push(current);
    }
    lastDigit.current = to;
    setItems(sequence);
    setOffset(0);

    const frame = requestAnimationFrame(() => setOffset(sequence.length - 1));
    const duration = 120 + sequence.length * 45;
    const timeout = window.setTimeout(() => {
      setItems([to]);
      setOffset(0);
    }, duration);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [digit]);

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: "0.65em",
        height,
        overflow: "hidden",
        verticalAlign: "bottom",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 28%, black 72%, transparent)",
        maskImage:
          "linear-gradient(to bottom, transparent, black 28%, black 72%, transparent)",
      }}
    >
      <span
        style={{
          display: "block",
          transform: `translateY(-${offset * height}px)`,
          transition:
            offset === 0
              ? "none"
              : `transform ${120 + items.length * 45}ms cubic-bezier(.16, 1, .3, 1)`,
        }}
      >
        {items.map((n, i) => (
          <span
            key={`${n}-${i}`}
            style={{
              display: "block",
              height,
              lineHeight: `${height}px`,
              textAlign: "center",
            }}
          >
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

function AnimatedCount({ value, t }: { value: number; t: any }) {
  const formatted = value.toLocaleString();
  const chars = formatted.split("");
  let digitPlace = chars.filter((c) => /\d/.test(c)).length - 1;

  return (
    <div
      style={{
        height: 24,
        fontSize: 18,
        fontWeight: 500,
        color: t.text,
        fontVariantNumeric: "tabular-nums",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {chars.map((char, i) => {
        if (!/\d/.test(char)) {
          return (
            <span key={`sep-${i}`} style={{ lineHeight: "24px" }}>
              {char}
            </span>
          );
        }
        const key = `digit-${digitPlace}`;
        digitPlace -= 1;
        return <DigitReel key={key} digit={Number(char)} />;
      })}
    </div>
  );
}

// ─── Waitlist form ───────────────────────────────────────────────────────────

function WaitlistForm({
  t,
  onSubmit,
}: {
  t: any;
  onSubmit: (data: { email: string }) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const fieldStyle = (error = false) => ({
    background: t.bg2,
    color: t.text,
    border: `0.5px solid ${error ? t.errorText : t.border}`,
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box" as const,
    fontFamily: "inherit",
    outline: "none",
  });

  const handleSubmit = async () => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setEmailErr(true);
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ email });
    } catch (err) {
      console.error("Waitlist error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <Label t={t}>Email address</Label>
        <input
          type="email"
          value={email}
          placeholder="you@example.com"
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailErr(false);
          }}
          style={fieldStyle(emailErr)}
        />
        {emailErr && (
          <div
            style={{
              fontSize: 12,
              color: t.errorText,
              background: t.errorBg,
              padding: "6px 10px",
              borderRadius: 8,
              marginTop: 6,
            }}
          >
            Please enter a valid email address.
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%",
          background: t.btn,
          color: t.btnText,
          border: "none",
          borderRadius: 8,
          padding: 11,
          fontSize: 14,
          fontWeight: 500,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          fontFamily: "inherit",
        }}
      >
        {loading ? "Joining…" : "Join the waitlist"}
      </button>
      <p
        style={{
          fontSize: 11,
          color: t.hint,
          textAlign: "center",
          margin: "8px 0 0",
        }}
      >
        No spam. Unsubscribe anytime.{" "}
        <a href="/privacy" style={{ color: t.hint, textDecoration: "underline" }}>
          Privacy policy
        </a>
        .
      </p>
    </div>
  );
}

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
    <div style={{ background: t.bg, minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>

      {/* ── Hero: full-screen split ───────────────────────────────────────── */}
      <main className="auth-layout anim-soft-enter">

        {/* Left: animated chart */}
        <aside className="auth-visual">
          <AuthChartAnimation />
          <div className="auth-visual-copy auth-visual-copy-top anim-fade-up">
            <p>Finsec</p>
            <h1>Track markets, assets, and operations in one place.</h1>
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