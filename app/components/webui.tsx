import { FAQS } from '~/data/FAQ';
import { useEffect, useState, useRef } from 'react';
import { theme, ACCENT } from './UI/UI';

// ─── FAQ ────────────────────────────────────────────────────────────────────

export function FAQ({ t }: { t: any }) {
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

export function DigitReel({ digit }: { digit: number }) {
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

export function AnimatedCount({ value, t }: { value: number; t: any }) {
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


export function StepText({
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