import {
  ACCENT,
  DANGER,
  SUCCESS,
  panelStyle,
  cornerStyle,
  theme,
} from "~/components/UI";

export { ACCENT };

export function MockStrategyInput() {
  const t = theme.dark;

  return (
    <div
      style={{
        ...panelStyle(t),
        padding: "1rem",
        fontFamily: "var(--font-code), monospace",
        fontSize: 11,
        color: t.muted,
      }}
    >
      <div style={cornerStyle()} />

      <div style={{ color: t.muted2, marginBottom: 10 }}>STRATEGY INPUT</div>

      <div style={{ lineHeight: 1.8 }}>
        <span style={{ color: t.text }}>When</span>{" "}
        <span style={{ color: ACCENT }}>RSI crosses below 30</span>
        <br />
        <span style={{ color: t.text }}>And</span>{" "}
        <span style={{ color: ACCENT }}>price reclaims 50MA</span>
        <br />
        <span style={{ color: t.text }}>Then</span>{" "}
        <span style={{ color: SUCCESS }}>open long</span>
        <br />
        <span style={{ color: t.text }}>Exit</span>{" "}
        <span style={{ color: DANGER }}>on −2.5% stop</span>
      </div>
    </div>
  );
}

export function MockRuleCard() {
  const t = theme.dark;

  const rows = [
    ["entry.rsi", "< 30"],
    ["entry.ma50", "reclaim"],
    ["risk.stop", "−2.5%"],
    ["risk.size", "1.0R"],
  ];

  return (
    <div
      style={{
        ...panelStyle(t),
        padding: "1rem",
        fontFamily: "var(--font-code), monospace",
        fontSize: 11,
      }}
    >
      <div style={cornerStyle()} />

      <div style={{ color: t.muted2, marginBottom: 10 }}>STRUCTURED RULES</div>

      {rows.map(([key, value], i) => (
        <div
          key={key}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "1rem",
            padding: "0.55rem 0",
            borderBottom:
              i === rows.length - 1 ? "none" : `1px solid ${t.borderSoft}`,
          }}
        >
          <span style={{ color: t.muted }}>{key}</span>
          <span style={{ color: t.text }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

export function MockTradeLog() {
  const t = theme.dark;

  const rows = [
    ["09:45", "LONG", "+1.8%"],
    ["11:20", "HOLD", "rule held"],
    ["14:05", "EXIT", "+3.4%"],
  ];

  return (
    <div
      style={{
        ...panelStyle(t),
        padding: "1rem",
        fontFamily: "var(--font-code), monospace",
        fontSize: 11,
      }}
    >
      <div style={cornerStyle()} />

      <div style={{ color: t.muted2, marginBottom: 10 }}>LIVE EXECUTION LOG</div>

      {rows.map(([time, action, result], i) => (
        <div
          key={`${time}-${action}`}
          style={{
            display: "grid",
            gridTemplateColumns: "48px 1fr auto",
            gap: "0.75rem",
            padding: "0.55rem 0",
            borderBottom:
              i === rows.length - 1 ? "none" : `1px solid ${t.borderSoft}`,
          }}
        >
          <span style={{ color: t.muted2 }}>{time}</span>
          <span style={{ color: action === "LONG" ? SUCCESS : t.text }}>
            {action}
          </span>
          <span style={{ color: result.includes("+") ? SUCCESS : ACCENT }}>
            {result}
          </span>
        </div>
      ))}
    </div>
  );
}